/* ******************************************************************************
 * index.js                                                                     *
 * *************************************************************************/ /**
 *
 * @fileoverview React Chat component attached to the router and redux store
 *
 * Created on       August 5, 2018
 * @author          Dan Calacci
 * @author          Brec Hanson
 * @author          Jordan Reedie
 *
 * @copyright (c) 2018-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import { connect } from 'react-redux';

import {
    joinRoom,
    joinedRoom,
    muteAudio,
    showMeetingDoc,
    unMuteAudio,
} from 'redux/actions/chat';
import {
    riffAddUserToMeeting,
} from 'redux/actions/riff';
import { getMeetingSettings } from 'redux/selectors/config';
import { getRiffAuthToken } from 'redux/selectors/riff';
import { getUserEmail, getUserId } from 'redux/selectors/user';
import { getRoomId, getRoomName } from 'redux/selectors/chat';
import {
    WebRtcNick,
    addA11yBrowserAlert,
    logger,
} from 'libs/utils';

import { Chat } from './Chat';


const chatMapProps = {
    mapStateToProps: state => ({
        email: getUserEmail(state),
        inRoom: state.chat.inRoom,
        roomName: getRoomName(state),
        roomId: getRoomId(state),

        // state for mergeProps
        uid: getUserId(state),
        riffAuthToken: getRiffAuthToken(state),
    }),

    mapDispatchToProps: dispatch => ({
        joinMeeting: ({ displayName, roomId, roomName, meetingType, uid, email, riffAuthToken, webrtc }) => {
            if (getMeetingSettings().useConfigDoc) {
                dispatch(showMeetingDoc(getMeetingSettings().showDocOnJoin));
            }
            // if there is a room ID (we are in personal mode), we use that
            // otherwise use the name
            const webRtcRoom = roomId || roomName;
            logger.debug(`Chat.joinMeeting: calling riffAddUserToMeeting w/ room: "${webRtcRoom}"`);

            riffAddUserToMeeting(
                uid,
                email || '',
                webRtcRoom,
                displayName,
                meetingType,
                webRtcRoom,
                riffAuthToken
            );
            dispatch(joinRoom(webRtcRoom));
            webrtc.stopVolumeCollection();
            webrtc.joinRoom(webRtcRoom, function (err, rd) {
                logger.debug('Chat.joinMeeting: webrtc.joinRoom cb:', { err, rd });
                dispatch(joinedRoom(webRtcRoom));
            });
            // use nick property to share riff IDs with all users
            webrtc.changeNick(WebRtcNick.create(uid, displayName));
        },

        toggleMicOnOff: (muted, webrtc) => {
            // NOTE - currently keeping this at the top level because
            // it's used in both Lobby and Meeting
            // worth considering if we even need to be able to mute in Lobby
            // - jr 6.18.19
            logger.debug(muted);
            if (muted) {
                dispatch(unMuteAudio());
                // TODO side-effects
                webrtc.unmute();
            }
            else {
                dispatch(muteAudio());
                webrtc.mute();
            }
            addA11yBrowserAlert(`Microphone is ${muted ? 'on' : 'off'}.`, 'polite');
        },

        dispatch: dispatch,
    }),

    mergeProps: (stateProps, dispatchProps, ownProps) => ({
        ...ownProps,
        ...stateProps,
        ...dispatchProps,

        joinMeeting: ({ displayName, roomName, meetingType, webrtc }) => {
            dispatchProps.joinMeeting({
                displayName,
                roomId: stateProps.roomId,
                roomName,
                meetingType,
                webrtc,
                uid: stateProps.uid,
                email: stateProps.email,
                riffAuthToken: stateProps.riffAuthToken,
            });
        },
    }),
};


const ConnectedChat = connect(chatMapProps.mapStateToProps,
                              chatMapProps.mapDispatchToProps,
                              chatMapProps.mergeProps)(Chat);

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    ConnectedChat as Chat,
};
