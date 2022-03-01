/* ******************************************************************************
 * middleware.js                                                                *
 * *************************************************************************/ /**
 *
 * @fileoverview riff-integration middleware for actions triggered by jitsi state updates
 *
 * The middleware defined here is added to the jitsi middleware using the MiddlewareRegistry
 * so this file exports nothing.
 *
 * Created on       January 3, 2022
 * @author          Jordan Reedie
 *
 * @copyright (c) 2022 Riff Analytics,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

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
    setRiffMeetingContext,
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
        window.addEventListener('beforeunload', _onbeforeunload(store));
        break;

    case CONFERENCE_LEFT:
        store.dispatch(riffRemoveUserFromMeeting());
        window.removeEventListener('beforeunload', _onbeforeunload(store));
        break;
    case SET_LOCATION_URL:
        // eslint-disable-next-line object-property-newline
        _updateRiffInfoFromUrl(store);
    }

    return result;
});


/**
 * Private function to be called when browser unloads window.
 * Ensures the user is removed from the meeting on the data server.
 *
 * @param {Store} store - The redux store.
 *
 * @returns {void}
 */
function _onbeforeunload(store) {
    return () => store.dispatch(riffRemoveUserFromMeeting());
}

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
    const urlRiffMeetingContext = urlParams['riffInfo.meetingContext'];

    if (urlRiffParticipantId) {
        dispatch(setRiffParticipantId(urlRiffParticipantId));
    }

    if (urlRiffMeetingTitle) {
        dispatch(setRiffMeetingTitle(urlRiffMeetingTitle));
    }

    if (urlRiffMeetingContext) {
        dispatch(setRiffMeetingContext(urlRiffMeetingContext));
    }
}
