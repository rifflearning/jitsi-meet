
import { MiddlewareRegistry } from '../../../base/redux';
import {
    googleSignOut,
    microsoftSignOut
} from '../../actions/calendarSync';
import { msCalendarSync } from '../../calendarSyncFunctions';
import { CALENDAR_CLEAR_MS_INTEGRATION, CALENDAR_SET_MS_AUTH_STATE, LOGOUT } from '../../constants/actionTypes';

// eslint-disable-next-line no-unused-vars
MiddlewareRegistry.register(({ getState, dispatch }) => next => action => {
    const result = next(action);

    switch (action.type) {
    case CALENDAR_CLEAR_MS_INTEGRATION:
        msCalendarSync.set({});
        break;
    case CALENDAR_SET_MS_AUTH_STATE:
        msCalendarSync.set(action.msAuthState);
        break;
    case LOGOUT:
        dispatch(googleSignOut());
        dispatch(microsoftSignOut());
    }

    return result;
});
