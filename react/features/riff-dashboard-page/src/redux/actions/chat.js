/* ******************************************************************************
 * chat.js                                                                      *
 * *************************************************************************/ /**
 *
 * @fileoverview Redux Chat action creators
 *
 * Created on       August 5, 2018
 * @author          Dan Calacci
 * @author          Jordan Reedie
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2018-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import {
    ADD_PEER,
    ADD_SHARED_SCREEN,
    CHAT_CHANGE_DISPLAY_NAME,
    CHAT_CHANGE_ROOM_ID,
    CHAT_CHANGE_ROOM_NAME,
    CHAT_GET_DISPLAY_ERROR,
    CHAT_GET_MEDIA_ERROR,
    CHAT_LEAVE_ROOM,
    CHAT_READY_TO_CALL,
    CHAT_SHARE_STREAM,
    CHAT_SHOW_MEETING_DOC,
    CHAT_URL_SHARE_START,
    CHAT_URL_SHARE_STOP,
    CHAT_VOLUME_CHANGED,
    CHAT_WEBRTC_ID_CHANGE,
    JOINED_ROOM,
    JOIN_ROOM,
    MUTE_AUDIO,
    REMOVE_PEER,
    REMOVE_SHARED_SCREEN,
    SHARE_SCREEN,
    UNMUTE_AUDIO,
} from 'redux/constants/ActionTypes';
import { ActionTypes } from 'redux/constants';
import { addA11yBrowserAlert, logger } from 'libs/utils';

const addPeer = (peer) => {
    addA11yBrowserAlert(`${peer.peer.nick.split('|')[1]} joined the room.`, 'polite');
    return {
        type: ADD_PEER,
        peer: peer,
    };
};

const removePeer = (peer) => {
    addA11yBrowserAlert(`${peer.peer.nick.split('|')[1]} left the room.`, 'polite');
    return {
        type: REMOVE_PEER,
        peer: peer,
    };
};

const addSharedScreen = (video, isUserSharing) => {
    return {
        type: ADD_SHARED_SCREEN,
        video,
        isUserSharing,
    };
};

const removeSharedScreen = () => {
    return {
        type: REMOVE_SHARED_SCREEN,
    };
};


const urlShareStart = (url, isUserSharing) => {
    return {
        type: CHAT_URL_SHARE_START,
        url,
        isUserSharing,
    };
};

const urlShareStop = () => {
    return {
        type: CHAT_URL_SHARE_STOP,
    };
};

const readyToCall = (roomName) => {
    return {
        type: CHAT_READY_TO_CALL,
        roomName: roomName,
    };
};

const shareStream = (stream) => {
    return {
        type: CHAT_SHARE_STREAM,
        stream: stream,
    };
};

const shareScreen = () => {
    return {
        type: SHARE_SCREEN,
    };
};

const showMeetingDoc = (show) => {
    return {
        type: CHAT_SHOW_MEETING_DOC,
        show,
    };
};

const volumeChanged = (vol) => {
    return {
        type: CHAT_VOLUME_CHANGED,
        volume: vol,
    };
};

/**
 * getMediaError is invoked when there
 * is an error requesting a user's webcam
 * or microphone
 */
const getMediaError = (error) => {
    return {
        type: CHAT_GET_MEDIA_ERROR,
        error: error,
    };
};

/**
 * getDisplayError is invoked when there
 * is an error requesting a user's screen
 * for screen sharing
 */
const getDisplayError = (error) => {
    return {
        type: CHAT_GET_DISPLAY_ERROR,
        error: error,
    };
};

const changeRoomName = ({ roomName, isUserSettable = true }) => {
    return {
        type: CHAT_CHANGE_ROOM_NAME,
        roomName,
        isUserSettable,
    };
};

const changeRoomId = (roomId) => {
    return {
        type: CHAT_CHANGE_ROOM_ID,
        roomId
    };
};

const setInviteId = (inviteId) => {
    return {
        type: ActionTypes.CHAT_SET_INVITE_ID,
        inviteId,
    };
};

const changeDisplayName = ({ displayName, isUserSettable = true }) => {
    return {
        type: CHAT_CHANGE_DISPLAY_NAME,
        displayName,
        isUserSettable,
    };
};

const joinRoom = (roomName) => {
    return {
        type: JOIN_ROOM,
        roomName: roomName,
    };
};

const joinedRoom = (name) => {
    return {
        type: JOINED_ROOM,
        name: name,
    };
};

const saveLocalWebrtcId = (webRtcId) => {
    logger.debug('saving local webrtc id:', webRtcId);
    return {
        type: CHAT_WEBRTC_ID_CHANGE,
        webRtcId: webRtcId,
    };
};

const muteAudio = () => {
    logger.info('action/chat: muting audio');
    return { type: MUTE_AUDIO };
};

const unMuteAudio = () => {
    return { type: UNMUTE_AUDIO };
};

const leaveRoom = () => {
    return { type: CHAT_LEAVE_ROOM };
};

/* ******************************************************************************
 * givePostMeetingSurvey                                                   */ /**
 * (sync action)
 *
 * Give the post meeting survey for the specified meeting.
 *
 * @returns {ReduxAction}
 */
function givePostMeetingSurvey(meetingId) {
    if (!meetingId) {
        const emsg = 'action.chat.givePostMeetingSurvey: meetingId cannot be an empty string';
        logger.error(emsg);
        throw new RangeError(emsg);
    }

    const action = {
        type: ActionTypes.CHAT_POST_MEETING_SURVEY_GIVE,
        meetingId,
    };

    return action;
}

/* ******************************************************************************
 * dismissPostMeetingSurvey                                                */ /**
 * (sync action)
 *
 * Dismiss the post meeting survey. Does nothing if there is no current post
 * meeting survey. Does not specify which meeting the dismissed survey
 * was for or if the survey was completed or dismissed w/o being completed.
 *
 * @returns {ReduxAction}
 */
function dismissPostMeetingSurvey() {
    const action = {
        type: ActionTypes.CHAT_POST_MEETING_SURVEY_DISMISS,
    };

    return action;
}


/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    addPeer,
    addSharedScreen,
    changeDisplayName,
    changeRoomName,
    changeRoomId,
    dismissPostMeetingSurvey,
    getDisplayError,
    getMediaError,
    givePostMeetingSurvey,
    joinedRoom,
    joinRoom,
    leaveRoom,
    muteAudio,
    readyToCall,
    removePeer,
    removeSharedScreen,
    saveLocalWebrtcId,
    setInviteId,
    shareScreen,
    shareStream,
    showMeetingDoc,
    unMuteAudio,
    urlShareStart,
    urlShareStop,
    volumeChanged,
};
