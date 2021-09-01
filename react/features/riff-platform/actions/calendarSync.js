/* eslint-disable no-unused-vars */
import { Client } from '@microsoft/microsoft-graph-client';
import base64js from 'base64-js';

import { createDeferred } from '../../../../modules/util/helpers';
import { parseStandardURIString, parseURLParams } from '../../base/util';
import googleApi from '../../google-api/googleApi.web';
import {
    CALENDAR_SET_GOOGLE_API_STATE,
    CALENDAR_CLEAR_GOOGLE_INTEGRATION,
    CALENDAR_SET_GOOGLE_ERROR,
    CALENDAR_SET_GOOGLE_INTEGRATION,
    CALENDAR_SET_GOOGLE_API_PROFILE,
    CALENDAR_SET_MS_AUTH_STATE,
    CALENDAR_SET_MS_API_PROFILE,
    CALENDAR_CLEAR_MS_INTEGRATION,
    CALENDAR_SET_MS_INTEGRATION,
    CALENDAR_SET_MS_ERROR
} from '../constants/actionTypes';

export const GOOGLE_API_STATES = {
    /**
     * The state in which the Google API still needs to be loaded.
     */
    NEEDS_LOADING: 0,

    /**
     * The state in which the Google API is loaded and ready for use.
     */
    LOADED: 1,

    /**
     * The state in which a user has been logged in through the Google API.
     */
    SIGNED_IN: 2,

    /**
     * The state in which the Google authentication is not available (e.g. Play
     * services are not installed on Android).
     */
    NOT_AVAILABLE: 3
};

export const ERRORS = {
    AUTH_FAILED: 'sign_in_failed',
    GOOGLE_APP_MISCONFIGURED: 'idpiframe_initialization_failed'
};

/**
 * Google API auth scope to access Google calendar.
 *
 * @type {string}
 */
export const GOOGLE_SCOPE_CALENDAR = 'https://www.googleapis.com/auth/calendar';
const GOOGLE_EDIT_LINK = 'https://calendar.google.com/calendar/r/eventedit';

const isGoogleCalendarEnabled = state => {
    const {
        enableCalendarIntegration,
        googleApiApplicationClientID
    } = state['features/base/config'] || {};

    return Boolean(enableCalendarIntegration && googleApiApplicationClientID);
};

/**
 * Loads Google API.
 *
 * @returns {Function}
 */
export function loadGoogleAPI() {
    return (dispatch, getState) =>
        googleApi.get()
            .then(() => {
                const {
                    enableCalendarIntegration,
                    googleApiApplicationClientID
                } = getState()['features/base/config'];

                if (getState()['features/riff-platform'].calendarSync?.google?.googleAPIState
                    === GOOGLE_API_STATES.NEEDS_LOADING) {
                    return googleApi.initializeClient(
                        googleApiApplicationClientID, false, enableCalendarIntegration);
                }

                return Promise.resolve();
            })
            .then(() => dispatch(setGoogleAPIState(GOOGLE_API_STATES.LOADED)))
            .then(() => googleApi.isSignedIn())
            .then(isSignedIn => {
                if (isSignedIn) {
                    dispatch(setGoogleAPIState(GOOGLE_API_STATES.SIGNED_IN));
                }
            });
}

/**
 * Sets the current Google API state.
 *
 * @param {number} googleAPIState - The state to be set.
 * @param {Object} googleResponse - The last response from Google.
 * @returns {{
 *     type: CALENDAR_SET_GOOGLE_API_STATE,
 *     googleAPIState: number
 * }}
 */
export function setGoogleAPIState(
        googleAPIState, googleResponse) {
    return {
        type: CALENDAR_SET_GOOGLE_API_STATE,
        googleAPIState,
        googleResponse
    };
}

/**
 * Prompts the participant to sign in to the Google API Client Library.
 *
 * @returns {function(Dispatch<any>): Promise<string | never>}
 */
export function signIn() {
    return dispatch => googleApi.get()
        .then(() => googleApi.signInIfNotSignedIn())
        .then(() => dispatch({
            type: CALENDAR_SET_GOOGLE_API_STATE,
            googleAPIState: GOOGLE_API_STATES.SIGNED_IN
        }));
}

/**
 * Logs out the user.
 *
 * @returns {function(Dispatch<any>): Promise<string | never>}
 */
export function signOut() {
    return dispatch =>
        googleApi.get()
            .then(() => googleApi.signOut())
            .then(() => {
                dispatch({
                    type: CALENDAR_CLEAR_GOOGLE_INTEGRATION
                });
                dispatch({
                    type: CALENDAR_SET_GOOGLE_API_STATE,
                    googleAPIState: GOOGLE_API_STATES.LOADED
                });
                dispatch({
                    type: CALENDAR_SET_GOOGLE_API_PROFILE,
                    profileEmail: ''
                });
            });
}

/**
 * Sets the initial state of calendar integration by loading third party APIs
 * and filling out any data that needs to be fetched.
 *
 * @returns {Function}
 */
export function bootstrapCalendarIntegration() {
    return (dispatch, getState) => {
        const state = getState();

        if (!isGoogleCalendarEnabled(state)) {
            return Promise.reject();
        }

        const {
            googleApiApplicationClientID
        } = state['features/base/config'];
        const {
            integrationReady
        } = state['features/riff-platform'].calendarSync.google;

        return Promise.resolve()
            .then(() => {
                if (googleApiApplicationClientID) {
                    return dispatch(loadGoogleAPI());
                }
            })
            .then(() => {
                if (integrationReady) {
                    return;
                }

                return googleApi.isSignedIn()
                    .then(signedIn => {
                        console.log('signedIn', signedIn);
                        if (signedIn) {
                            dispatch(updateGoogleEmailProfile());

                            return dispatch(setGoogleIntegrationReady());
                        }

                        return dispatch(clearGoogleCalendarIntegration());

                    });
            });
    };
}

/**
 * Resets the state of calendar integration so stored events and selected
 * calendar type are cleared.
 *
 * @returns {{
 *     type: CLEAR_CALENDAR_INTEGRATION
 * }}
 */
export function clearGoogleCalendarIntegration() {
    return {
        type: CALENDAR_CLEAR_GOOGLE_INTEGRATION
    };
}

/**
 * Sends an action to update the calendar error state in redux.
 *
 * @param {Object} error - An object with error details.
 * @returns {{
 *     type: SET_CALENDAR_ERROR,
 *     error: Object
 * }}
 */
export function setCalendarError(error) {
    return {
        type: CALENDAR_SET_GOOGLE_ERROR,
        error
    };
}

/**
 * Sets the calendar the integration is ready to be used.
 *
 * @returns {{
 *      type: CALENDAR_SET_GOOGLE_INTEGRATION,
 *      integrationReady: boolean,
 * }}
 */
export function setGoogleIntegrationReady() {
    return {
        type: CALENDAR_SET_GOOGLE_INTEGRATION,
        integrationReady: true
    };
}

/**
 * Signals to get current profile data linked to the current calendar
 * integration that is in use.
 *
 * @param {string} email - Profile email.
 * @returns {Function}
 */
export function setCalendarProfileEmail(email) {
    return {
        type: CALENDAR_SET_GOOGLE_API_PROFILE,
        profileEmail: email
    };
}

// eslint-disable-next-line require-jsdoc
export function updateGoogleEmailProfile() {
    return dispatch => googleApi.getCurrentUserProfile()
        .then(profile => dispatch(setCalendarProfileEmail(profile.getEmail())));
}

/**
 * Signals signing in to the specified calendar integration.
 *
 * @param {string} calendarType - The calendar integration which should be
 * signed into.
 * @returns {Function}
 */
export function googleSignIn() {
    return dispatch =>

        dispatch(loadGoogleAPI())
            .then(() => dispatch(signIn()))
            .then(() => dispatch(setGoogleIntegrationReady()))

             .then(() => dispatch(updateGoogleEmailProfile()))
            .catch(error => {
                // TODO add logger
                console.error(
                    'Error occurred while signing into calendar integration',
                    error);

                return Promise.reject(error);
            });
}

// eslint-disable-next-line require-jsdoc
function getCalendarEntry(calendarId, eventId) {
    return googleApi._getGoogleApiClient()
        .client.calendar.events.get({
            'calendarId': calendarId,
            'eventId': eventId
        });
}

// eslint-disable-next-line require-jsdoc
function updateCalendarEntry(calendarId, event) {
    return googleApi.get()
        .then(() => googleApi.isSignedIn())
        .then(isSignedIn => {
            if (!isSignedIn) {
                return null;
            }

            return googleApi._getGoogleApiClient()
                .client.calendar.events.patch({
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
}

// eslint-disable-next-line require-jsdoc
function createCalendarEntry(calendarId, event) {
    return googleApi.get()
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
}

// eslint-disable-next-line require-jsdoc
export function insertCalendarEntry(calendarId, event) {
    return dispatch =>
        googleApi.get()
            .then(() => googleApi.isSignedIn())
            .then(isSignedIn => {
                if (isSignedIn) {
                    return Promise.resolve();
                }

                return Promise.reject({
                    error: ERRORS.AUTH_FAILED
                });
            })

            .then(() => {
                dispatch(setCalendarError());
            }, error => {
                console.error('Error fetching calendar.', error);

                if (error.error === ERRORS.AUTH_FAILED) {
                    dispatch(clearGoogleCalendarIntegration());

                    return dispatch(googleSignIn());
                }

                dispatch(setCalendarError(error));
            })
            .then(() => getCalendarEntry(calendarId, event.id))
            .then(calendarEvent => {
                if (calendarEvent) {
                    return updateCalendarEntry(calendarId, event);
                }
                createCalendarEntry(calendarId, event);
                dispatch(setCalendarError());
            }, error => {
                console.error('Event not found', error);

                createCalendarEntry(calendarId, event);
            });
}


//

/**
 * Constants used for interacting with the Microsoft API.
 *
 * @private
 * @type {object}
 */
const MS_API_CONFIGURATION = {
    /**
     * The URL to use when authenticating using Microsoft API.
     * @type {string}
     */
    AUTH_ENDPOINT:
        'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?',

    CALENDAR_ENDPOINT: '/me/calendars',

    /**
     * The Microsoft API scopes to request access for calendar.
     *
     * @type {string}
     */
    MS_API_SCOPES: 'openid profile Calendars.ReadWrite',

    /**
     * See https://docs.microsoft.com/en-us/azure/active-directory/develop/
     * v2-oauth2-implicit-grant-flow#send-the-sign-in-request. This value is
     * needed for passing in the proper domain_hint value when trying to refresh
     * a token silently.
     *
     *
     * @type {string}
     */
    MS_CONSUMER_TENANT: '9188040d-6c67-4c5b-b112-36a304b66dad',

    /**
     * The redirect URL to be used by the Microsoft API on successful
     * authentication.
     *
     * @type {string}
     */
    REDIRECT_URI: `${window.location.origin}/static/msredirect.html`
};


/**
 * Sends an action to update the current calendar api auth state in redux.
 * This is used only for microsoft implementation to store it auth state.
 *
 * @param {number} newState - The new state.
 * @returns {{
 *     type: SET_CALENDAR_AUTH_STATE,
 *     msAuthState: Object
 * }}
 */
export function setMsCalendarAPIAuthState(newState) {
    return {
        type: CALENDAR_SET_MS_AUTH_STATE,
        msAuthState: newState
    };
}

/**
 * Resets the state of calendar integration so stored events and selected
 * calendar type are cleared.
 *
 * @returns {{
 *     type: CLEAR_CALENDAR_INTEGRATION
 * }}
 */
export function clearMsCalendarIntegration() {
    return {
        type: CALENDAR_CLEAR_MS_INTEGRATION
    };
}

/**
 * Sends an action to update the calendar error state in redux.
 *
 * @param {Object} error - An object with error details.
 * @returns {{
 *     type: SET_CALENDAR_ERROR,
 *     error: Object
 * }}
 */
export function setMsCalendarError(error) {
    return {
        type: CALENDAR_SET_MS_ERROR,
        error
    };
}

/**
 * Sets the calendar the integration is ready to be used.
 *
 * @returns {{
 *      type: CALENDAR_SET_GOOGLE_INTEGRATION,
 *      integrationReady: boolean,
 * }}
 */
export function setMsIntegrationReady() {
    return {
        type: CALENDAR_SET_MS_INTEGRATION,
        integrationReady: true
    };
}

/**
 * Signals to get current profile data linked to the current calendar
 * integration that is in use.
 *
 * @param {string} email - Profile email.
 * @returns {Function}
 */
export function setMsCalendarProfileEmail(email) {
    return {
        type: CALENDAR_SET_MS_API_PROFILE,
        profileEmail: email
    };
}

/**
 * Store the window from an auth request. That way it can be reused if a new
 * request comes in and it can be used to indicate a request is in progress.
 *
 * @private
 * @type {Object|null}
 */
let popupAuthWindow = null;

/**
     * Prompts the participant to sign in to the Microsoft API Client Library.
     *
     * @returns {function(Dispatch<any>, Function): Promise<void>}
     */
export function microsoftSignIn() {
    return (dispatch, getState) => {
        // Ensure only one popup window at a time.
        if (popupAuthWindow) {
            popupAuthWindow.focus();

            return Promise.reject('Sign in already in progress.');
        }

        const signInDeferred = createDeferred();

        const guids = {
            authState: generateGuid(),
            authNonce: generateGuid()
        };

        dispatch(setMsCalendarAPIAuthState(guids));

        const { microsoftApiApplicationClientID }
                = getState()['features/base/config'];
        const authUrl = getAuthUrl(
                microsoftApiApplicationClientID,
                guids.authState,
                guids.authNonce);
        const h = 600;
        const w = 480;

        popupAuthWindow = window.open(
                authUrl,
                'Auth M$',
                `width=${w}, height=${h}, top=${
                    (screen.height / 2) - (h / 2)}, left=${
                    (screen.width / 2) - (w / 2)}`);

        const windowCloseCheck = setInterval(() => {
            if (popupAuthWindow && popupAuthWindow.closed) {
                signInDeferred.reject(
                        'Popup closed before completing auth.');
                popupAuthWindow = null;
                window.removeEventListener('message', handleAuth);
                clearInterval(windowCloseCheck);
            } else if (!popupAuthWindow) {
                // This case probably happened because the user completed
                // auth.
                clearInterval(windowCloseCheck);
            }
        }, 500);

        /**
             * Callback with scope access to other variables that are part of
             * the sign in request.
             *
             * @param {Object} event - The event from the post message.
             * @private
             * @returns {void}
             */
        function handleAuth({ data }) {
            if (!data || data.type !== 'ms-login') {
                return;
            }

            window.removeEventListener('message', handleAuth);

            popupAuthWindow && popupAuthWindow.close();
            popupAuthWindow = null;

            const params = getParamsFromHash(data.url);
            const tokenParts = getValidatedTokenParts(
                    params, guids, microsoftApiApplicationClientID);

            if (!tokenParts) {
                signInDeferred.reject('Invalid token received');

                return;
            }

            dispatch(setMsCalendarAPIAuthState({
                authState: undefined,
                accessToken: tokenParts.accessToken,
                idToken: tokenParts.idToken,
                tokenExpires: params.tokenExpires,
                userDomainType: tokenParts.userDomainType,
                userSigninName: tokenParts.userSigninName
            }));

            signInDeferred.resolve();
        }

        window.addEventListener('message', handleAuth);

        return signInDeferred.promise;
    };
}

/**
* Returns whether or not the user is currently signed in.
*
* @returns {function(Dispatch<any>, Function): Promise<boolean>}
*/
export function microsoftIsSignedIn() {
    return (dispatch, getState) => {
        const now = new Date().getTime();
        const state
           = getState()['features/riff-platform'].calendarSync.microsoft.msAuthState || {};
        const tokenExpires = parseInt(state.tokenExpires, 10);
        const isExpired = now > tokenExpires && !isNaN(tokenExpires);

        if (state.accessToken && isExpired) {
            // token expired, let's refresh it
            return dispatch(refreshAuthToken())
               .then(() => true)
               .catch(() => false);
        }

        return Promise.resolve(state.accessToken && !isExpired);
    };
}

/**
 * Renews an existing auth token so it can continue to be used.
 *
 * @private
 * @returns {function(Dispatch<any>, Function): Promise<void>}
 */
function refreshAuthToken() {
    return (dispatch, getState) => {
        const { microsoftApiApplicationClientID }
            = getState()['features/base/config'];
        const { msAuthState = {} }
            = getState()['features/riff-platform'].calendarSync.microsoft || {};

        const refreshAuthUrl = getAuthRefreshUrl(
            microsoftApiApplicationClientID,
            msAuthState.userDomainType,
            msAuthState.userSigninName);

        const iframe = document.createElement('iframe');

        iframe.setAttribute('id', 'auth-iframe');
        iframe.setAttribute('name', 'auth-iframe');
        iframe.setAttribute('style', 'display: none');
        iframe.setAttribute('src', refreshAuthUrl);

        const signInPromise = new Promise(resolve => {
            iframe.onload = () => {
                resolve(iframe.contentWindow.location.hash);
            };
        });

        // The check for body existence is done for flow, which also runs
        // against native where document.body may not be defined.
        if (!document.body) {
            return Promise.reject(
                'Cannot refresh auth token in this environment');
        }

        document.body.appendChild(iframe);

        return signInPromise.then(hash => {
            const params = getParamsFromHash(hash);

            dispatch(setMsCalendarAPIAuthState({
                accessToken: params.access_token,
                idToken: params.id_token,
                tokenExpires: params.tokenExpires
            }));
        });
    };
}

const checkMsAuth = token => {

    if (!token) {
        return Promise.reject({ error: ERRORS.AUTH_FAILED });
    }

    return Promise.resolve();
};


// eslint-disable-next-line require-jsdoc
export function createMsCalendarEntry(calendarId, event) {
    return (dispatch, getState) => {
        const state
        = getState()['features/riff-platform'].calendarSync.microsoft.msAuthState || {};
        const token = state.accessToken;

        checkMsAuth(token)
        .then(() => Promise.resolve(), error => {
            if (error.error === ERRORS.AUTH_FAILED) {
                return dispatch(microsoftSignIn());
            }
        })
        .then(r => {
            console.log('r', r);
            const client = Client.init({
                authProvider: done => done(null, token)
            });

            return client
                        .api('/me/events/')
                        .post(event)
                        .then(res => {

                            console.log('res', res);
                            if (res?.id) {

                                const eventUrl = res.webLink;

                                window.open(eventUrl, '_blank').focus();
                            }
                        });
        });

    };
}

const isMsCalendarEnabled = state => {
    const {
        enableCalendarIntegration,
        microsoftApiApplicationClientID
    } = state['features/base/config'] || {};

    return Boolean(enableCalendarIntegration && microsoftApiApplicationClientID);
};

/**
 * Sets the initial state of calendar integration by loading third party APIs
 * and filling out any data that needs to be fetched.
 *
 * @returns {Function}
 */
export function bootstrapMsCalendarIntegration() {
    return (dispatch, getState) => {
        const state = getState();

        if (!isMsCalendarEnabled(state)) {
            return Promise.reject();
        }
        const {
            integrationReady
        } = state['features/riff-platform'].calendarSync.microsoft;

        return Promise.resolve()
            .then(() => {
                if (integrationReady) {
                    return;
                }

                return dispatch(microsoftIsSignedIn())
                    .then(signedIn => {
                        console.log('signedIn ms', signedIn);
                        if (signedIn) {
                            dispatch(updateMsEmailProfile());

                            return dispatch(setMsIntegrationReady());
                        }

                        return dispatch(clearMsCalendarIntegration());

                    });
            });
    };
}

/**
     * Returns the email address for the currently logged in user.
     *
     * @returns {function(Dispatch<*, Function>): Promise<string>}
     */
export function updateMsEmailProfile() {
    return (dispatch, getState) => {
        const { msAuthState = {} }
                = getState()['features/riff-platform'].calendarSync.microsoft || {};
        const email = msAuthState.userSigninName || '';

        return Promise.resolve(email);
    };
}


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
function getAuthRefreshUrl(appId, userDomainType, userSigninName) {
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
function getAuthUrl(appId, authState, authNonce) {
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
function getParamsFromHash(url) {
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
function getValidatedTokenParts(tokenInfo, guids, appId) {
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
function generateGuid() {
    const buf = new Uint16Array(8);

    window.crypto.getRandomValues(buf);

    return `${s4(buf[0])}${s4(buf[1])}-${s4(buf[2])}-${s4(buf[3])}-${
        s4(buf[4])}-${s4(buf[5])}${s4(buf[6])}${s4(buf[7])}`;
}
