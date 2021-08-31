
import { GOOGLE_API_STATES } from '../actions/calendarSync';
import {
    CALENDAR_SET_GOOGLE_API_STATE,
    CALENDAR_CLEAR_GOOGLE_INTEGRATION,
    CALENDAR_SET_GOOGLE_ERROR,
    CALENDAR_SET_GOOGLE_INTEGRATION,
    CALENDAR_SET_GOOGLE_API_PROFILE
} from '../constants/actionTypes';

const DEFAULT_GOOGLE_STATE = {
    google: {
        googleAPIState: GOOGLE_API_STATES.NEEDS_LOADING,
        authorization: null,
        integrationReady: false,
        error: null
    }
};

export default (state = DEFAULT_GOOGLE_STATE, action) => {
    switch (action.type) {
    case CALENDAR_CLEAR_GOOGLE_INTEGRATION:
        return {
            ...state,
            google: DEFAULT_GOOGLE_STATE
        };
    case CALENDAR_SET_GOOGLE_API_STATE:
        return {
            ...state,
            google: {
                ...state.google,
                googleAPIState: action.googleAPIState,
                googleResponse: action.googleResponse
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
    }

    return state;
};
