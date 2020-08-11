/* ******************************************************************************
 * chat.js                                                                      *
 * *************************************************************************/ /**
 *
 * @fileoverview Chat redux reducer function
 *
 * Handler for redux actions which modify the chat redux state.
 *
 * Created on       August 1, 2018
 * @author          Dan Calacci
 *
 * @copyright (c) 2018-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import {
    WebRtcNick,
    logger
} from '../../libraries/utils';
import { ActionTypes } from '../../redux/constants';
import {
    ADD_PEER,
    ADD_SHARED_SCREEN,
    CHAT_CHANGE_DISPLAY_NAME,
    CHAT_CHANGE_ROOM_ID,
    CHAT_CHANGE_ROOM_NAME,
    CHAT_DISPLAY_NAME_CHANGE,
    CHAT_GET_DISPLAY_ERROR,
    CHAT_GET_MEDIA_ERROR,
    CHAT_LEAVE_ROOM,
    CHAT_READY_TO_CALL,
    CHAT_SET_WEBRTC_CONFIG,
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
    RIFF_MEETING_ID_UPDATE,
    SHARE_SCREEN,
    TEXT_CHAT_MSG_UPDATE,
    TEXT_CHAT_SET_BADGE,
    UNMUTE_AUDIO
} from '../../redux/constants/ActionTypes';

const initialState = {
    joiningRoom: false,
    getMediaError: true,
    inRoom: false,
    roomName: '',
    roomId: null,
    inviteId: null,
    isRoomNameUserSettable: true,
    audioMuted: false,
    displayName: '',
    isDisplayNameUserSettable: true,
    joinRoomError: null,
    savedDisplayName: false,
    savedDisplayMessage: '',
    volume: 0,
    webRtcId: '',

    // confusingly, we have both a roomName and
    // a webRtcRoom
    // it seems that webRtcRoom is populated only after
    // the user joins a room
    // and roomName is not used thereafter
    webRtcRoom: '',
    webRtcPeers: [],
    webRtcPeerDisplayNames: [],
    webRtcRiffIds: [],
    sharedScreen: null,
    sharedUrl: null,
    isUserSharing: false,
    shouldDisplayDoc: true,
    readyToCall: false,
    webRtc: {
        config: null,
        signalMasterPath: ''
    },
    textchat: {
        messages: [],
        lastRoom: '',
        lastMeetingId: '',
        badge: false
    },

    /** meeting id that post meeting survey is for, empty string if the survey has
     * been answered or otherwise dismissed by the user
     */
    givePostMeetingSurvey: ''
};

// handle keeping or removing messages depending on riff meeting ID,
// not room name.
const handleTextChatOnMeetingIdChange = (meetingId, textchat) => {
    // TODO loose -> strict equality?
    if (textchat.lastMeetingId && textchat.lastMeetingId === meetingId) {
        logger.debug('SAME MEETING ID, not clearing chat...');

        return textchat;
    }

    if (textchat.lastMeetingId) {
        // different meetingId
        logger.debug('DIFFERENT MEETING ID, clearing chat...');

        return {
            ...textchat,
            lastMeetingId: meetingId,
            messages: []
        };
    }

    logger.debug('NO LAST MEETING ID, clearing chat...');


    // no last meetingId, return same thing to be safe.
    // keeping this here in case we want to do different in the future.
    return {
        ...textchat,
        lastMeetingId: meetingId,
        messages: []
    };
};

const chat = (state = initialState, action) => {
    switch (action.type) {
    case RIFF_MEETING_ID_UPDATE:
        logger.debug('GOT MEETING ID UPDATE IN CHAT');

        return {
            ...state,
            textchat: handleTextChatOnMeetingIdChange(action.meetingId,
                                                          state.textchat)
        };

    case JOIN_ROOM:
        return {
            ...state,
            joiningRoom: true,
            webRtcRoom: action.roomName,
            inRoom: false
        };

    case CHAT_CHANGE_ROOM_NAME:
        return {
            ...state,
            roomName: action.roomName,
            isRoomNameUserSettable: action.isUserSettable !== false // true unless explicitly set to false
        };

    case CHAT_CHANGE_ROOM_ID:
        return {
            ...state,
            roomId: action.roomId
        };

    case CHAT_CHANGE_DISPLAY_NAME:
        return {
            ...state,
            displayName: action.displayName,
            isDisplayNameUserSettable: action.isUserSettable !== false // true unless explicitly set to false
        };

    case CHAT_SET_WEBRTC_CONFIG:
        return {
            ...state,
            webRtc: {
                config: action.webRtcConfig,
                signalMasterPath: action.signalMasterPath
            }
        };

    case ADD_PEER: {
        // this removes any null peers
        logger.debug('adding peer', action);
        const [ riffId, displayName ] = WebRtcNick.getIdAndDisplayName(action.peer.peer.nick);

        logger.debug('adding peer', riffId, displayName);
        const peers = state.webRtcPeers.filter(n => !(n === null));
        const peerIds = state.webRtcPeers.map(p => p.id);

        if (peerIds.indexOf(action.peer.id) >= 1) {
            logger.debug('not re-adding a peer...');

            return state;
        }

        const peer = action.peer.peer;
        const allPeers = [ ...peers, peer ];
        const { displayNames, riffIds } = getPeerNamesAndIds(allPeers);

        return {
            ...state,
            webRtcPeers: allPeers,
            webRtcPeerDisplayNames: displayNames,
            webRtcRiffIds: riffIds
        };
    }

    case REMOVE_PEER: {
        const index = state.webRtcPeers.map(item => item.id).indexOf(action.peer.peer.id);
        const allPeers = [
            ...state.webRtcPeers.slice(0, index),
            ...state.webRtcPeers.slice(index + 1)
        ];
        const { displayNames, riffIds } = getPeerNamesAndIds(allPeers);

        return {
            ...state,
            webRtcPeers: allPeers,
            webRtcPeerDisplayNames: displayNames,
            webRtcRiffIds: riffIds
        };
    }

    case ADD_SHARED_SCREEN: {
        if (state.isUserSharing) {
            // we only allow one shared item at a time.
            // we should be checking for this before allowing the user to share
            // but just in case
            return state;
        }

        return {
            ...state,
            sharedScreen: action.video,
            isUserSharing: action.isUserSharing
        };
    }

    case REMOVE_SHARED_SCREEN:
        return {
            ...state,
            sharedScreen: null,
            isUserSharing: false
        };

    case CHAT_URL_SHARE_START:
        // sanity check - users should not be able to share URLs while
        // another item is being shared
        // if this occurs, abort
        if (state.sharedUrl !== null || state.sharedScreen !== null) {
            return state;
        }

        return {
            ...state,
            isUserSharing: action.isUserSharing,
            sharedUrl: action.url
        };

    case CHAT_URL_SHARE_STOP:
        return {
            ...state,
            isUserSharing: false,
            sharedUrl: null
        };

    case CHAT_DISPLAY_NAME_CHANGE:
        logger.debug('saving display name in firebase: ', action);

        return {
            ...state,
            savedDisplayName: action.status === 'success',
            savedDisplayMessage: action.message || ''
        };

    case CHAT_SHOW_MEETING_DOC:
        return {
            ...state,
            shouldDisplayDoc: action.show
        };

    case CHAT_WEBRTC_ID_CHANGE:
        logger.debug('webrtc ID change:', action);

        return { ...state,
            webRtcId: action.webRtcId };

    case CHAT_GET_MEDIA_ERROR:
        return { ...state,
            getMediaError: action.error };

    case CHAT_GET_DISPLAY_ERROR:
        return { ...state };

    case CHAT_READY_TO_CALL:
        return { ...state,
            readyToCall: true,
            getMediaError: false };

    case JOINED_ROOM:
        return { ...state,
            inRoom: true,
            joiningRoom: false };

    case CHAT_LEAVE_ROOM:
        return {
            ...state,
            webRtcRoom: '',
            inRoom: false,
            webRtcPeers: [],
            webRtcPeerDisplayNames: [],
            webRtcRiffIds: [],
            savedDisplayName: false
        };

    case CHAT_VOLUME_CHANGED:
        if (action.volume !== null) {
            // FIXME uh, what is happening here? -jr
            const vol1 = ((120 - Math.abs(action.volume)) / 120) * 100;

            // FIXME especially what the hell is happening here -jr
            const vol2 = (Math.ceil(vol1) / 20) * 20;

            if (vol2 > 0) {
                return { ...state,
                    volume: vol2 };
            }
        }

        return state;

    case MUTE_AUDIO:
        return { ...state,
            audioMuted: true };

    case UNMUTE_AUDIO:
        return { ...state,
            audioMuted: false };

    case SHARE_SCREEN:
        // FIXME this doesn't, ah, technically do anything
        return state;

    case TEXT_CHAT_MSG_UPDATE: {
        // will never be a message this user has sent (will always be peer)
        const { displayNames, riffIds } = getPeerNamesAndIds(state.webRtcPeers);
        const peerIdx = riffIds.indexOf(action.messageObj.participant);
        const dispName = displayNames[peerIdx];
        const msg = {
            ...action.messageObj,
            name: dispName
        };

        return {
            ...state,
            textchat: {
                ...state.textchat,
                messages: [
                    ...state.textchat.messages,
                    msg
                ]
            }
        };
    }

    case TEXT_CHAT_SET_BADGE:
        return {
            ...state,
            textchat: {
                ...state.textchat,
                badge: action.badgeValue
            }
        };

    case ActionTypes.CHAT_SET_INVITE_ID:
        return {
            ...state,
            inviteId: action.inviteId
        };

    case ActionTypes.CHAT_POST_MEETING_SURVEY_DISMISS:
        return {
            ...state,
            givePostMeetingSurvey: ''
        };

    case ActionTypes.CHAT_POST_MEETING_SURVEY_GIVE:
        return {
            ...state,
            givePostMeetingSurvey: action.meetingId || ''
        };


    default:
        return state;
    }
};

/**
 * Get the list of display names and the list of riff ids from
 * a list of peers.
 *
 * @example
 * let {displayNames, riffIds} = getPeerNamesAndIds(peers);
 */
function getPeerNamesAndIds(peers) {
    const retObj = { displayNames: [],
        riffIds: [] };

    for (const peer of peers) {
        const nick = new WebRtcNick(peer.nick);

        retObj.riffIds.push(nick.riffId);
        retObj.displayNames.push(nick.displayName);
    }

    return retObj;
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    chat
};
