import googleApi from '../../google-api/googleApi.web';
import {
    CALENDAR_SET_GOOGLE_API_STATE,
    CALENDAR_CLEAR_GOOGLE_INTEGRATION,
    CALENDAR_SET_GOOGLE_ERROR,
    CALENDAR_SET_GOOGLE_INTEGRATION,
    CALENDAR_SET_GOOGLE_API_PROFILE
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
                            return dispatch(setGoogleIntegrationReady());

                            // return true;

                            // dispatch(updateProfile(integrationType));
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

            // .then(() => dispatch(updateGoogleProfile()))
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

