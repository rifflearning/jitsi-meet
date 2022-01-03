import {
    connectToRiffDataServer,
    riffAddUserToMeeting,
    riffRemoveUserFromMeeting,
} from '../../riff-integration/actions';
import { attachSibilant } from '../../riff-integration/functions';
import { APP_WILL_MOUNT } from '../base/app';
import { CONFERENCE_JOINED, CONFERENCE_LEFT } from '../base/conference';
import { MiddlewareRegistry } from '../base/redux';
import { TRACK_ADDED } from '../base/tracks';

/*
 * Any riff actions that need to be triggered via jitsi state updates
 * should go here
 */
MiddlewareRegistry.register(({ dispatch, getState }) => next => action => {
    switch (action.type) {
    case APP_WILL_MOUNT:
        // start connection process as soon as the app will mount to ensure
        // we have a connection before we need it (i.e. when the user clicks 'join')
        dispatch(connectToRiffDataServer())
        break;
    case TRACK_ADDED:
        // (re-)attach sibilant whenever a new local audio track is added
        if (action.track.isLocalAudioTrack()) {
            attachSibilant(action.track.getTrack(), getState);
        }
        break;
    case CONFERENCE_JOINED:
        dispatch(riffAddUserToMeeting());
        break;
    case CONFERENCE_LEFT:
        dispatch(riffRemoveUserFromMeeting());
        break;
    }
    return next(action);
});
