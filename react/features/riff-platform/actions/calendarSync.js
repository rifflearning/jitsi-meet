import { loadGoogleAPI, isSignedIn, load, signIn, updateCalendarEvent } from '../../google-api';

// import {
//     CLEAR_CALENDAR_INTEGRATION,
//     SET_CALENDAR_AUTH_STATE,
//     SET_CALENDAR_ERROR,
//     SET_CALENDAR_INTEGRATION,
//     SET_CALENDAR_PROFILE_EMAIL,
//     SET_LOADING_CALENDAR_EVENTS
// } from './actionTypes';

const isGoogleCalendarEnabled = state => {
    const {
        enableCalendarIntegration,
        googleApiApplicationClientID
    } = state['features/base/config'] || {};

    return Boolean(enableCalendarIntegration && googleApiApplicationClientID);
};


/**
 * Sets the initial state of calendar integration by loading third party APIs
 * and filling out any data that needs to be fetched.
 *
 * @returns {Function}
 */
export function bootstrapCalendarIntegration(): Function {
    return (dispatch, getState) => {
        const state = getState();

        if (!isGoogleCalendarEnabled(state)) {
            return Promise.reject();
        }

        const {
            googleApiApplicationClientID
        } = state['features/base/config'];
        const {
            integrationReady,
            integrationType
        } = state['features/riff-platform'].calendarSync.google;

        return Promise.resolve()
            .then(() => {
                if (googleApiApplicationClientID) {
                    return dispatch(loadGoogleAPI());
                }
            })
            .then(() => {
                if (!integrationType || integrationReady) {
                    return;
                }

                // const integrationToLoad
                //     = _getCalendarIntegration(integrationType);

                // if (!integrationToLoad) {
                //     dispatch(clearCalendarIntegration());

                //     return;
                // }

                return dispatch(isSignedIn())
                    .then(signedIn => {
                        if (signedIn) {
                            dispatch(setGoogleIntegrationReady('google'));
                            // dispatch(updateProfile(integrationType));
                        } else {
                            dispatch(clearGoogleCalendarIntegration());
                        }
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
        type: CLEAR_GOOGLE_CALENDAR_INTEGRATION
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
export function setCalendarError(error: ?Object) {
    return {
        type: SET_GOOGLE_CALENDAR_ERROR,
        error
    };
}

/**
 * Sends an action to update the current calendar profile email state in redux.
 *
 * @param {number} newEmail - The new email.
 * @returns {{
 *     type: SET_CALENDAR_PROFILE_EMAIL,
 *     email: string
 * }}
 */
export function setGoogleCalendarProfileEmail(newEmail: ?string) {
    return {
        type: SET_GOOGLE_CALENDAR_PROFILE_EMAIL,
        email: newEmail
    };
}

/**
 * Sets the calendar integration type to be used by web and signals that the
 * integration is ready to be used.
 *
 * @param {string|undefined} integrationType - The calendar type.
 * @returns {{
 *      type: SET_CALENDAR_INTEGRATION,
 *      integrationReady: boolean,
 * }}
 */
export function setGoogleIntegrationReady() {
    return {
        type: SET_GOOGLE_CALENDAR_INTEGRATION,
        integrationReady: true,
    };
}

/**
 * Signals signing in to the specified calendar integration.
 *
 * @param {string} calendarType - The calendar integration which should be
 * signed into.
 * @returns {Function}
 */
export function googleSignIn(): Function {
    return (dispatch: Dispatch<any>) => {
        // const integration = _getCalendarIntegration(calendarType);

        // if (!integration) {
        //     return Promise.reject('No supported integration found');
        // }

        return dispatch(load())
            .then(() => dispatch(signIn()))
            .then(() => dispatch(setGoogleIntegrationReady()))
            // .then(() => dispatch(updateGoogleProfile()))
            .catch(error => {
                //TODO add logger
                console.error(
                    'Error occurred while signing into calendar integration',
                    error);

                return Promise.reject(error);
            });
    };
}

/**
 * Updates calendar event by generating new invite URL and editing the event
 * adding some descriptive text and location.
 *
 * @param {string} event - The event id.
 * @param {string} calendarId - The id of the calendar to use.
 * @returns {Function}
 */
export function updateGoogleCalendarEvent(calendarId, event): Function {
    return (dispatch: Dispatch<any>, getState: Function) => {


    };
}

// /**
//  * Signals to get current profile data linked to the current calendar
//  * integration that is in use.
//  *
//  * @param {string} calendarType - The calendar integration to which the profile
//  * should be updated.
//  * @returns {Function}
//  */
// export function updateGoogleProfile(calendarType: string): Function {
//     return (dispatch: Dispatch<any>) => {
//         // const integration = _getCalendarIntegration(calendarType);

//         // if (!integration) {
//         //     return Promise.reject('No integration found');
//         // }

//         return dispatch(integration.getCurrentEmail())
//             .then(email => {
//                 dispatch(setCalendarProfileEmail(email));
//             });
//     };
// }
