/* ******************************************************************************
 * actions.js                                                                   *
 * *************************************************************************/ /**
 *
 * @fileoverview riff-integration redux action creators
 *
 * Created on       January 3, 2022
 * @author          Jordan Reedie
 *
 * @copyright (c) 2022 Riff Analytics,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import {
    RIFF_SET_MEETING_CONTEXT,
    RIFF_SET_MEETING_TITLE,
    RIFF_SET_PARTICIPANT_ID,
} from './actionTypes';

/**
 * Redux action to set Riff meeting context
 *
 * @param {string} meetingContext - The meeting context
 * @returns {Object}
 */
function setRiffMeetingContext(meetingContext) {
    return {
        type: RIFF_SET_MEETING_CONTEXT,
        meetingContext,
    };
}

/**
 * Redux action to set Riff meeting title
 *
 * @param {string} meetingTitle - The meeting title
 * @returns {Object}
 */
function setRiffMeetingTitle(meetingTitle) {
    return {
        type: RIFF_SET_MEETING_TITLE,
        meetingTitle,
    };
}

/**
 * Redux action to set Riff participant ID
 *
 * @param {string} participantId - The local user's Riff Id
 * @returns {Object}
 */
function setRiffParticipantId(participantId) {
    return {
        type: RIFF_SET_PARTICIPANT_ID,
        participantId,
    };
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    setRiffMeetingContext,
    setRiffMeetingTitle,
    setRiffParticipantId,
};
