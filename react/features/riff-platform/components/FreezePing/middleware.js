import { MiddlewareRegistry } from '../../../base/redux';
import { APP_WILL_MOUNT, APP_WILL_UNMOUNT } from '../../../base/app/actionTypes';
import { registerSound, unregisterSound } from '../../../base/sounds';
import { PING_MSG_SOUND_FILE, PING_MSG_SOUND_ID} from './constants';

/**
 * Implements the middleware of the freeze ping feature.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry.register(store => next => action => {
    const { dispatch } = store;

    switch (action.type) {
        case APP_WILL_MOUNT:
            dispatch(registerSound(PING_MSG_SOUND_ID, PING_MSG_SOUND_FILE));
            break;

        case APP_WILL_UNMOUNT:
            dispatch(unregisterSound(PING_MSG_SOUND_ID));
            break;
    }

    return next(action);
});
