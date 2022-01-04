import _ from 'lodash';

import {
    connectToRiffDataServer,
    riffAddUserToMeeting,
    riffRemoveUserFromMeeting,
    setRiffMeetingTitle,
    setRiffParticipantId,
} from '../../riff-integration/actions';
import { attachSibilant } from '../../riff-integration/functions';
import { APP_WILL_MOUNT } from '../base/app';
import { CONFERENCE_JOINED, CONFERENCE_LEFT } from '../base/conference';
import { SET_LOCATION_URL } from '../base/connection';
import { MiddlewareRegistry } from '../base/redux';
import { TRACK_ADDED } from '../base/tracks';
import { parseURLParams } from '../base/util';


/*
 * Any riff actions that need to be triggered via jitsi state updates
 * should go here
 */
MiddlewareRegistry.register(({ dispatch, getState }) => next => action => {
    switch (action.type) {
    case APP_WILL_MOUNT:
        // start connection process as soon as the app will mount to ensure
        // we have a connection before we need it (i.e. when the user clicks 'join')
        dispatch(connectToRiffDataServer());
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
    case SET_LOCATION_URL:
        // eslint-disable-next-line object-property-newline
        _updateRiffInfoFromUrl({ dispatch, getState });
    }

    return next(action);
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
