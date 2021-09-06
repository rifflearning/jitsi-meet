/* eslint-disable no-unused-vars */
import { Client } from '@microsoft/microsoft-graph-client';

import { createDeferred } from '../../../../modules/util/helpers';
import googleApi from '../../google-api/googleApi.web';
import {
    isGoogleCalendarEnabled,
    updateGoogleCalendarEntry,
    createGoogleCalendarEntry,
    msCalendarSync,
    isMsCalendarEnabled,
    generateGuid,
    getValidatedTokenParts,
    getParamsFromHash,
    getAuthUrl,
    getAuthRefreshUrl
} from '../calendarSyncFunctions';
import {
    CALENDAR_SET_GOOGLE_API_STATE,
    CALENDAR_CLEAR_GOOGLE_INTEGRATION,
    CALENDAR_SET_GOOGLE_ERROR,
    CALENDAR_SET_GOOGLE_INTEGRATION,
    CALENDAR_SET_GOOGLE_API_PROFILE,
    CALENDAR_SET_MS_AUTH_STATE,
    CALENDAR_CLEAR_MS_INTEGRATION,
    CALENDAR_SET_MS_INTEGRATION,
    CALENDAR_SET_MS_ERROR
} from '../constants/actionTypes';
import {
    GOOGLE_API_STATES,
    ERRORS
} from '../constants/calendarSync';

/**
 * Sets the current Google API state.
 *
 * @param {number} googleAPIState - The state to be set.
 * @returns {{
 *     type: CALENDAR_SET_GOOGLE_API_STATE,
 *     googleAPIState: number
 * }}
 */
function setGoogleAPIState(googleAPIState) {
    return {
        type: CALENDAR_SET_GOOGLE_API_STATE,
        googleAPIState
    };
}

/**
 * Resets the state of google calendar integration.
 *
 * @returns {{
 *     type: CALENDAR_CLEAR_GOOGLE_INTEGRATION
 * }}
 */
function clearGoogleCalendarIntegration() {
    return {
        type: CALENDAR_CLEAR_GOOGLE_INTEGRATION
    };
}

/**
 * Sends an action to update the google calendar error state in redux.
 *
 * @param {Object} error - An object with error details.
 * @returns {{
 *     type: SET_CALENDAR_ERROR,
 *     error: Object
 * }}
 */
function setGoogleCalendarError(error) {
    return {
        type: CALENDAR_SET_GOOGLE_ERROR,
        error
    };
}

/**
 * Sets the google calendar the integration is ready to be used.
 *
 * @returns {{
 *      type: CALENDAR_SET_GOOGLE_INTEGRATION,
 *      integrationReady: boolean,
 * }}
 */
function setGoogleIntegrationReady() {
    return {
        type: CALENDAR_SET_GOOGLE_INTEGRATION,
        integrationReady: true
    };
}

/**
 * Sets the google profile email.
 *
 * @param {string} email - Profile email.
 * @returns {{
 *      type: CALENDAR_SET_GOOGLE_API_PROFILE,
 *      profileEmail: string,
 * }}
 */
function setGoogleCalendarProfileEmail(email) {
    return {
        type: CALENDAR_SET_GOOGLE_API_PROFILE,
        profileEmail: email
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
 * Disconnect from google.
 *
 * @returns {function(Dispatch<any>): Promise<string | never>}
 */
export function googleSignOut() {
    return dispatch =>
        googleApi.get()
            .then(api =>
                api.auth2
                && api.auth2.getAuthInstance
                && api.auth2.getAuthInstance()
                && api.auth2.getAuthInstance().disconnect())
            .then(() => {
                dispatch({
                    type: CALENDAR_CLEAR_GOOGLE_INTEGRATION
                });
            });
}

/**
 * Loads Google API.
 *
 * @returns {Function}
 */
function loadGoogleAPI() {
    return (dispatch, getState) =>
        googleApi.get()
            .then(() => {
                const {
                    enableCalendarIntegration,
                    googleApiApplicationClientID
                } = getState()['features/base/config'];

                if (getState()['features/riff-platform'].calendarSync.google.googleAPIState
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
 * Updates the google profile email.
 *
 * @returns {Function}
 */
function updateGoogleEmailProfile() {
    return dispatch => googleApi.getCurrentUserProfile()
        .then(profile => dispatch(setGoogleCalendarProfileEmail(profile.getEmail())));
}

/**
 * Signals signing in to the google calendar integration.
 *
 * @returns {Promise}
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

/**
 * Creates or updates google calendar event.
 *
 * @param {string} calendarId - User's calendar id (default 'primary').
 * @param {Object} event - Meeting event.
 * @returns {Promise}
 */
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
                dispatch(setGoogleCalendarError());
            }, error => {
                console.error('Error fetching calendar.', error);

                if (error.error === ERRORS.AUTH_FAILED) {
                    dispatch(clearGoogleCalendarIntegration());

                    return dispatch(googleSignIn());
                }

                dispatch(setGoogleCalendarError(error));
            })
            .then(() => createGoogleCalendarEntry(calendarId, event))
            .then(() => {
                dispatch(setGoogleCalendarError());

                return Promise.resolve();
            }, error => {
                console.log(error.result?.error?.message);

                // https://developers.google.com/calendar/api/guides/errors#409_the_requested_identifier_already_exists
                // Error code when instance with the given ID already exists in the googlestorage.
                // in this case update event
                if (error.status === 409) {
                    updateGoogleCalendarEntry(calendarId, event);
                }
            });
}

/**
 * Sends an action to update the current microsoft calendar api auth state in redux.
 *
 * @param {number} newState - The new microsoft auth state.
 * @returns {{
 *     type: CALENDAR_SET_MS_AUTH_STATE,
 *     msAuthState: Object
 * }}
 */
function setMsCalendarAPIAuthState(newState) {
    return {
        type: CALENDAR_SET_MS_AUTH_STATE,
        msAuthState: newState
    };
}

/**
 * Resets the state of microsoft calendar integration.
 *
 * @returns {{
 *     type: CALENDAR_CLEAR_MS_INTEGRATION
 * }}
 */
function clearMsCalendarIntegration() {
    return {
        type: CALENDAR_CLEAR_MS_INTEGRATION
    };
}

/**
 * Sends an action to update the ms calendar error state in redux.
 *
 * @param {Object} error - An object with error details.
 * @returns {{
 *     type: CALENDAR_SET_MS_ERROR,
 *     error: Object
 * }}
 */
function setMsCalendarError(error) {
    return {
        type: CALENDAR_SET_MS_ERROR,
        error
    };
}

/**
 * Sets the calendar the integration is ready to be used.
 *
 * @returns {{
 *      type: CALENDAR_SET_MS_INTEGRATION,
 *      integrationReady: boolean,
 * }}
 */
function setMsIntegrationReady() {
    return {
        type: CALENDAR_SET_MS_INTEGRATION,
        integrationReady: true
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
            `width=${w}, height=${h}, top=${(screen.height / 2) - (h / 2)}, left=${(screen.width / 2) - (w / 2)}`);

        const windowCloseCheck = setInterval(() => {
            if (popupAuthWindow && popupAuthWindow.closed) {
                signInDeferred.reject('Popup closed before completing auth.');

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
            dispatch(setMsIntegrationReady());

            return signInDeferred.resolve();
        }

        window.addEventListener('message', handleAuth);

        return signInDeferred.promise;
    };
}

/**
* Returns whether or not the ms user is currently signed in.
*
* @returns {function(Dispatch<any>, Function): Promise<boolean>}
*/
function microsoftIsSignedIn() {
    return (dispatch, getState) => {
        const now = new Date().getTime();
        const state
            = getState()['features/riff-platform'].calendarSync.microsoft.msAuthState || {};
        const tokenExpires = parseInt(state.tokenExpires, 10);
        const isExpired = now > tokenExpires && !isNaN(tokenExpires);

        if (state.accessToken && isExpired) {
            console.log('inside refresh');

            // token expired, let's refresh it
            return dispatch(refreshAuthToken())
                .then(() => true)
                .catch(() => false);
        }

        return Promise.resolve(Boolean(state.accessToken) && !isExpired);
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

/**
 * Creates microsoft calendar event for current user's calendar.
 *
 * @param {Object} event - Meeting event.
 * @returns {Promise}
 */
export function createMsCalendarEntry(event) {
    return (dispatch, getState) =>

        dispatch(microsoftIsSignedIn())
            .then(isSigned => {
                if (!isSigned) {
                    return Promise.reject({ error: ERRORS.AUTH_FAILED });
                }

                return Promise.resolve(isSigned);
            })
            .then(() => Promise.resolve(), error => {
                if (error.error === ERRORS.AUTH_FAILED) {
                    return dispatch(microsoftSignIn());
                }
            })
            .then(() => {
                const state
                    = getState()['features/riff-platform'].calendarSync.microsoft.msAuthState || {};
                const token = state.accessToken;

                const client = Client.init({
                    authProvider: done => done(null, token)
                });

                return client

                    .api('/me/events/')
                    .post(event)
                    .then(e => {
                        if (e?.id) {
                            const eventUrl = e.webLink;

                            window.open(eventUrl, '_blank').focus();
                        }
                    }, () =>
                        client
                            .api('/me/events')
                            .filter(`singleValueExtendedProperties/Any(ep: ep/id eq '${event.singleValueExtendedProperties[0].id}' and ep/value eq '${event.singleValueExtendedProperties[0].value}')`)
                            .get()
                    )
                    .then(res => {
                        const createdEvent = res?.value[0];

                        if (createdEvent?.transactionId === event.transactionId) {
                            return client
                                .api(`/me/events/${createdEvent.id}`)
                                .update(event);
                        }
                    })
                    .then(e => {
                        if (e?.id) {
                            const eventUrl = e.webLink;

                            window.open(eventUrl, '_blank').focus();
                        }
                    })
                    .catch(error => {
                        console.log('error', error);
                    });
            });
}

/**
 * Sets the initial state of calendar integration by loading third party microsoft APIs
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
        const msAuthState = msCalendarSync.get();

        // check localStorage
        if (msAuthState?.accessToken) {
            dispatch(setMsCalendarAPIAuthState(msAuthState));
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
                        if (signedIn) {
                            return dispatch(setMsIntegrationReady());
                        }

                        // return dispatch(clearMsCalendarIntegration());

                    });
            });
    };
}

/**
 * Disconnect from microsoft.
 *
 * @returns {function(Dispatch<any>): Promise<string | never>}
 */
export function microsoftSignOut() {
    return dispatch => dispatch(clearMsCalendarIntegration());
}
