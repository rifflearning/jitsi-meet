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

import { SET_LOCATION_URL } from '../base/connection';
import { MiddlewareRegistry } from '../base/redux';
import { parseURLParams } from '../base/util';

import {
    setRiffMeetingContext,
    setRiffMeetingTitle,
    setRiffParticipantId,
} from './actions';

/*
 * Any riff actions that need to be triggered via jitsi state updates
 * should go here
 */
MiddlewareRegistry.register(store => next => action => {
    const result = next(action);

    switch (action.type) {
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
