import base64js from 'base64-js';

import { parseStandardURIString, parseURLParams } from '../base/util';
import googleApi from '../google-api/googleApi.web';

import {
    GOOGLE_EDIT_LINK,
    MS_API_CONFIGURATION
} from './constants/calendarSync';

export const isGoogleCalendarEnabled = state => {
    const {
        enableCalendarIntegration,
        googleApiApplicationClientID
    } = state['features/base/config'] || {};

    return Boolean(enableCalendarIntegration && googleApiApplicationClientID);
};

export const getGoogleCalendarEntry = (calendarId, eventId) => googleApi._getGoogleApiClient()
    .client.calendar.events.get({
        'calendarId': calendarId,
        'eventId': eventId
    });

export const updateGoogleCalendarEntry = (calendarId, event) => googleApi.get()
    .then(() => googleApi.isSignedIn())
    .then(isSignedIn => {
        if (!isSignedIn) {
            return null;
        }

        return googleApi._getGoogleApiClient()
            .client.calendar.events.update({
                'calendarId': calendarId,
                'eventId': event.id,
                'resource': event
            }).then(e => {
                if (e.status === 200) {
                    const eventId = new URL(e.result.htmlLink).searchParams.get('eid');
                    const eventUrl = `${GOOGLE_EDIT_LINK}/${eventId}`;

                    window.open(eventUrl, '_blank').focus();

                    return e.result;
                }
            });
    });

export const createGoogleCalendarEntry = (calendarId, event) => googleApi.get()
        .then(() => googleApi.isSignedIn())
        .then(isSignedIn => {
            if (!isSignedIn) {
                return null;
            }

            return googleApi._getGoogleApiClient()
                .client.calendar.events.insert({
                    'calendarId': calendarId,
                    'resource': event
                }).then(e => {
                    if (e.status === 200) {
                        const eventId = new URL(e.result.htmlLink).searchParams.get('eid');
                        const eventUrl = `${GOOGLE_EDIT_LINK}/${eventId}`;

                        window.open(eventUrl, '_blank').focus();

                        return e.result;
                    }
                });
        });

// Sets microsoft auth data to localStorage
export const msCalendarSync = {
    get() {
        return JSON.parse(localStorage.getItem('msCalendarSync'));
    },
    set(data) {
        return localStorage.setItem('msCalendarSync', JSON.stringify(data));
    }
};

export const isMsCalendarEnabled = state => {
    const {
        enableCalendarIntegration,
        microsoftApiApplicationClientID
    } = state['features/base/config'] || {};

    return Boolean(enableCalendarIntegration && microsoftApiApplicationClientID);
};

/**
 * Constructs and returns the URL to use for renewing an auth token.
 *
 * @param {string} appId - The Microsoft application id to log into.
 * @param {string} userDomainType - The domain type of the application as
 * provided by Microsoft.
 * @param {string} userSigninName - The email of the user signed into the
 * integration with Microsoft.
 * @private
 * @returns {string} - The auth URL.
 */
export function getAuthRefreshUrl(appId, userDomainType, userSigninName) {
    return [
        getAuthUrl(appId, 'undefined', 'undefined'),
        'prompt=none',
        `domain_hint=${userDomainType}`,
        `login_hint=${userSigninName}`
    ].join('&');
}

/**
 * Constructs and returns the auth URL to use for login.
 *
 * @param {string} appId - The Microsoft application id to log into.
 * @param {string} authState - The authState guid to use.
 * @param {string} authNonce - The authNonce guid to use.
 * @private
 * @returns {string} - The auth URL.
 */
export function getAuthUrl(appId, authState, authNonce) {
    const authParams = [
        'response_type=id_token+token',
        `client_id=${appId}`,
        `redirect_uri=${MS_API_CONFIGURATION.REDIRECT_URI}`,
        `scope=${MS_API_CONFIGURATION.MS_API_SCOPES}`,
        `state=${authState}`,
        `nonce=${authNonce}`,
        'response_mode=fragment'
    ].join('&');

    return `${MS_API_CONFIGURATION.AUTH_ENDPOINT}${authParams}`;
}

/**
 * Converts a url from an auth redirect into an object of parameters passed
 * into the url.
 *
 * @param {string} url - The string to parse.
 * @private
 * @returns {Object}
 */
export function getParamsFromHash(url) {
    const params = parseURLParams(parseStandardURIString(url), true, 'hash');

    // Get the number of seconds the token is valid for, subtract 5 minutes
    // to account for differences in clock settings and convert to ms.
    const expiresIn = (parseInt(params.expires_in, 10) - 300) * 1000;
    const now = new Date();
    const expireDate = new Date(now.getTime() + expiresIn);

    params.tokenExpires = expireDate.getTime().toString();

    return params;
}

/**
 * Converts the parameters from a Microsoft auth redirect into an object of
 * token parts. The value "null" will be returned if the params do not produce
 * a valid token.
 *
 * @param {Object} tokenInfo - The token object.
 * @param {Object} guids - The guids for authState and authNonce that should
 * match in the token.
 * @param {Object} appId - The Microsoft application this token is for.
 * @private
 * @returns {Object|null}
 */
export function getValidatedTokenParts(tokenInfo, guids, appId) {
    // Make sure the token matches the request source by matching the GUID.
    if (tokenInfo.state !== guids.authState) {
        return null;
    }

    const idToken = tokenInfo.id_token;

    // A token must exist to be valid.
    if (!idToken) {
        return null;
    }

    const tokenParts = idToken.split('.');

    if (tokenParts.length !== 3) {
        return null;
    }

    let payload;

    try {
        payload = JSON.parse(b64utoutf8(tokenParts[1]));
    } catch (e) {
        return null;
    }

    if (payload.nonce !== guids.authNonce
        || payload.aud !== appId
        || payload.iss
            !== `https://login.microsoftonline.com/${payload.tid}/v2.0`) {
        return null;
    }

    const now = new Date();

    // Adjust by 5 minutes to allow for inconsistencies in system clocks.
    const notBefore = new Date((payload.nbf - 300) * 1000);
    const expires = new Date((payload.exp + 300) * 1000);

    if (now < notBefore || now > expires) {
        return null;
    }

    return {
        accessToken: tokenInfo.access_token,
        idToken,
        userDisplayName: payload.name,
        userDomainType:
            payload.tid === MS_API_CONFIGURATION.MS_CONSUMER_TENANT
                ? 'consumers' : 'organizations',
        userSigninName: payload.preferred_username
    };
}

/**
 * Convert a Base64URL encoded string to a UTF-8 encoded string including CJK or Latin.
 *
 * @param {string} str - The string that needs conversion.
 * @private
 * @returns {string} - The converted string.
 */
function b64utoutf8(str) {
    let s = str;

    // Convert from Base64URL to Base64.

    if (s.length % 4 === 2) {
        s += '==';
    } else if (s.length % 4 === 3) {
        s += '=';
    }

    s = s.replace(/-/g, '+').replace(/_/g, '/');

    // Convert Base64 to a byte array.

    const bytes = base64js.toByteArray(s);

    // Convert bytes to hex.

    s = bytes.reduce((str_, byte) => str_ + byte.toString(16).padStart(2, '0'), '');

    // Convert a hexadecimal string to a URLComponent string

    s = s.replace(/(..)/g, '%$1');

    // Decodee the URI component

    return decodeURIComponent(s);
}

/**
 * Converts the passed in number to a string and ensure it is at least 4
 * characters in length, prepending 0's as needed.
 *
 * @param {number} num - The number to pad and convert to a string.
 * @private
 * @returns {string} - The number converted to a string.
 */
function s4(num) {
    let ret = num.toString(16);

    while (ret.length < 4) {
        ret = `0${ret}`;
    }

    return ret;
}

/**
 * Generate a guid to be used for verifying token validity.
 *
 * @private
 * @returns {string} The generated string.
 */
export function generateGuid() {
    const buf = new Uint16Array(8);

    window.crypto.getRandomValues(buf);

    return `${s4(buf[0])}${s4(buf[1])}-${s4(buf[2])}-${s4(buf[3])}-${
        s4(buf[4])}-${s4(buf[5])}${s4(buf[6])}${s4(buf[7])}`;
}
