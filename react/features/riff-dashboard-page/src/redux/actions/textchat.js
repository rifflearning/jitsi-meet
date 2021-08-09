/* ******************************************************************************
 * textchat.js                                                                  *
 * *************************************************************************/ /**
 *
 * @fileoverview Text chat in a meeting redux actions
 *
 * Created on       October 15, 2018
 * @author          Dan Calacci
 *
 * @copyright (c) 2018-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import { app } from 'libs/riffdata-client';
import { logger } from 'libs/utils';

import {
    TEXT_CHAT_MSG_UPDATE,
    TEXT_CHAT_SET_BADGE,
} from 'Redux/constants/ActionTypes';

const updateTextChat = (message, meeting, participant, time) => {
    const messageObj = { message, meeting, participant, time };
    return {
        type: TEXT_CHAT_MSG_UPDATE,
        messageObj,
    };
};

const setTextChatBadge = (badgeValue) => {
    return {
        type: TEXT_CHAT_SET_BADGE,
        badgeValue,
    };
};

const sendTextChatMsg = (message, participant, meeting) => (dispatch) => {
    return app.service('messages').create({
        msg: message,
        participant: participant,
        meeting: meeting
    })
    .then(function (result) {
        logger.debug('Action.TextChat: created a message!', result);
        dispatch(updateTextChat(result.msg,
                                result.meeting,
                                result.participant,
                                result.time));
        return undefined;
    })
    .catch(function (err) {
        logger.error('Action.TextChat: send msg errored out', err);
    });
};

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    sendTextChatMsg,
    setTextChatBadge,
    updateTextChat,
};
