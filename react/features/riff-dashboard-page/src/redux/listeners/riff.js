/* ******************************************************************************
 * riff.js                                                                      *
 * *************************************************************************/ /**
 *
 * @fileoverview Listen for riffdata server events and dispatch actions
 *
 * Created on       August 21, 2018
 * @author          Dan Calacci
 *
 * @copyright (c) 2018-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import { app } from 'libs/riffdata-client';
import { logger } from 'libs/utils';
import {
    updateIsMeetingStarted,
    updateMeetingParticipants,
    updateRiffMeetingId,
    updateTurnData,
} from 'Redux/actions/riff';
import { updateTextChat } from 'Redux/actions/textchat';
import { getUserId } from 'Redux/selectors/user';
import { getRiffMeetingId } from 'Redux/selectors/riff';


function transformTurns(participants, turns) {
    const filteredTurns = turns.filter(turn => participants.includes(turn.participant));
    return filteredTurns;
}

function addRiffListener(dispatch, getState) {
    // this listener listens for events ~from~ the server

    app.service('turns').on('updated', function (obj) {
        const state = getState();
        if (obj.room === state.chat.webRtcRoom && state.riff.participants.length > 1) {
            logger.debug('Listener.Riff: Updating turns');
            dispatch(updateTurnData(obj.transitions,
                                    transformTurns(state.riff.participants, obj.turns)));
        }
    });

    app.service('participantEvents').on('created', function (obj) {
        const state = getState();
        logger.debug('Listener.Riff.participantEvents.created: entered', { obj, expectedRoom: state.chat.webRtcRoom });
        // if a meeting has any participant events, that means it has been started
        if (obj.meeting.room === state.chat.roomId) {
            dispatch(updateIsMeetingStarted(true));
        }

        if (obj.meeting.room === state.chat.webRtcRoom) {
            logger.debug('Listener.Riff.participantEvents.created: updating participants',
                         { from: state.riff.participants, to: obj.participants, obj });
            // update meeting mediator data
            dispatch(updateMeetingParticipants(obj.participants));
            dispatch(updateRiffMeetingId(obj.meeting._id));
        }
    });

    app.service('messages').on('created', function (obj) {
        const state = getState();
        logger.debug('Listener.Riff.messages.created', obj);
        if (obj.meeting === getRiffMeetingId(state) &&
                obj.participant !== getUserId(state)) {
            dispatch(updateTextChat(
                obj.msg,
                obj.meeting,
                obj.participant,
                obj.time
            ));
        }
    });

    // this.app.service('meetings').on('patched', function (obj) {
    //   if (obj.room === state.chat.webRtcRoom) {
    //       logger.debug("Got update for meeting", obj.room);
    //       dispatch(meetingUpdated())
    //   }
    // })
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    addRiffListener,
};
