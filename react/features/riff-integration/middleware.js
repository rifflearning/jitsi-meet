import _ from 'lodash';

import { APP_WILL_MOUNT } from '../base/app';
import { CONFERENCE_JOINED, CONFERENCE_LEFT } from '../base/conference';
import { SET_LOCATION_URL } from '../base/connection';
import { MiddlewareRegistry } from '../base/redux';
import { TRACK_ADDED } from '../base/tracks';
import { parseURLParams } from '../base/util';

import {
    connectToRiffDataServer,
    riffAddUserToMeeting,
    riffRemoveUserFromMeeting,
    setRiffMeetingTitle,
    setRiffParticipantId,
} from './actions';
import { attachSibilant } from './functions';

/*
 * Any riff actions that need to be triggered via jitsi state updates
 * should go here
 */
MiddlewareRegistry.register(store => next => action => {
    const result = next(action);

    switch (action.type) {
    case APP_WILL_MOUNT:
        // start connection process as soon as the app will mount to ensure
        // we have a connection before we need it (i.e. when the user clicks 'join')
        store.dispatch(connectToRiffDataServer());
        break;
    case TRACK_ADDED:
        // (re-)attach sibilant whenever a new local audio track is added
        if (action.track.jitsiTrack.isLocalAudioTrack()) {
            attachSibilant(action.track.jitsiTrack.getTrack(), store.getState);
        }
        break;
    case CONFERENCE_JOINED:
        store.dispatch(riffAddUserToMeeting());
        break;
    case CONFERENCE_LEFT:
        store.dispatch(riffRemoveUserFromMeeting());
        break;
    case SET_LOCATION_URL:
        // eslint-disable-next-line object-property-newline
        _updateRiffInfoFromUrl(store);
    }

    return result;
});

/**
 * Private function to update redux state with values passed in
 * through the URL (e.g. via External API).
 *
 * @param {Store} store - The redux store.
 *
 * @returns {void}
 */
function _updateRiffInfoFromUrl({ dispatch, getState }) {
    const urlParams = parseURLParams(getState()['features/base/connection'].locationURL);
    const urlRiffParticipantId = urlParams['riffInfo.participantId'];
    const urlRiffMeetingTitle = urlParams['riffInfo.meetingTitle'];

    if (urlRiffParticipantId) {
        dispatch(setRiffParticipantId(_.escape(urlRiffParticipantId)));
    }

    if (urlRiffMeetingTitle) {
        dispatch(setRiffMeetingTitle(_.escape(urlRiffMeetingTitle)));
    }
}
