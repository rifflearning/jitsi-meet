
import {
    CALENDAR_SET_GOOGLE_API_STATE,
    CALENDAR_CLEAR_GOOGLE_INTEGRATION,
    CALENDAR_SET_GOOGLE_ERROR,
    CALENDAR_SET_GOOGLE_INTEGRATION,
    CALENDAR_SET_GOOGLE_API_PROFILE,
    CALENDAR_SET_MS_AUTH_STATE,
    CALENDAR_SET_MS_INTEGRATION,
    CALENDAR_CLEAR_MS_INTEGRATION
} from '../constants/actionTypes';
import { GOOGLE_API_STATES } from '../constants/calendarSync';

const DEFAULT_STATE = {
    google: {
        googleAPIState: GOOGLE_API_STATES.NEEDS_LOADING,
        integrationReady: false,
        error: null,
        profileEmail: ''
    },
    microsoft: {
        integrationReady: false,
        msAuthState: {},
        error: null
    }
};

export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
    case CALENDAR_CLEAR_GOOGLE_INTEGRATION:
        return {
            ...state,
            google: DEFAULT_STATE.google
        };
    case CALENDAR_SET_GOOGLE_API_STATE:
        return {
            ...state,
            google: {
                ...state.google,
                googleAPIState: action.googleAPIState
            }
        };

    case CALENDAR_SET_GOOGLE_ERROR:
        return {
            ...state,
            google: {
                ...state.google,
                error: action.error
            }
        };
    case CALENDAR_SET_GOOGLE_INTEGRATION:
        return {
            ...state,
            google: {
                ...state.google,
                integrationReady: action.integrationReady
            }
        };

    case CALENDAR_SET_GOOGLE_API_PROFILE:
        return {
            ...state,
            google: {
                ...state.google,
                profileEmail: action.profileEmail
            }
        };
    case CALENDAR_SET_MS_AUTH_STATE: {
        if (!action.msAuthState) {
            return {
                ...state,
                microsoft: {
                    ...state.microsoft,
                    msAuthState: {}
                }
            };
        }

        return {
            ...state,
            microsoft: {
                ...state.microsoft,
                msAuthState: {
                    ...state.microsoft.msAuthState,
                    ...action.msAuthState
                }
            }
        };
    }
    case CALENDAR_SET_MS_INTEGRATION: {
        return {
            ...state,
            microsoft: {
                ...state.microsoft,
                integrationReady: action.integrationReady
            }
        };
    }
    case CALENDAR_CLEAR_MS_INTEGRATION: {
        return {
            ...state,
            microsoft: DEFAULT_STATE.microsoft
        };
    }
    }

    return state;
};
