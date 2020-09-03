/* ******************************************************************************
 * index.js                                                                     *
 * *************************************************************************/ /**
 *
 * @fileoverview Connects PersonalModeLobby to redux
 *
 * Created on       May 4, 2020
 * @author          Jordan Reedie
 *
 * @copyright (c) 2020-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/
import { connect } from 'react-redux';

import {
    changeDisplayName,
    changeRoomName,
} from 'redux/actions/chat';
import { riffGetRoomFromId } from 'redux/actions/riff';
import {
    getDisplayName,
    getIsDisplayNameUserSettable,
    getIsHost,
    getIsRoomNameUserSettable,
    getRoomId,
    getRoomName,
} from 'redux/selectors/chat';

import { PersonalModeLobby } from './PersonalModeLobby';

const mapStateToProps = (state, ownProps) => ({
    displayName: getDisplayName(state),
    isDisplayNameUserSettable: getIsDisplayNameUserSettable(state),
    roomName: getRoomName(state),
    roomId: getRoomId(state),
    isHost: getIsHost(state),
    isMeetingStarted: state.riff.isMeetingStarted,
    isRoomNameUserSettable: getIsRoomNameUserSettable(state),
    isJoiningRoom: state.chat.joiningRoom,
    joinMeeting: (displayName, roomId, meetingType) => {
        ownProps.joinMeeting({
            displayName,
            roomId,
            meetingType,
            webrtc: ownProps.webrtc,
        });
    },
});

const mapDispatchToProps = dispatch => ({
    saveDisplayName: (displayName) => {
        dispatch(changeDisplayName({ displayName }));
    },
    getRoomName: async (roomId) => {
        const room = riffGetRoomFromId(roomId);
        if (room) {
            const roomName = room.title;
            dispatch(changeRoomName({ roomName, isUserSettable: false }));
        }
    },
});

const ConnectedPersonalModeLobby = connect(
    mapStateToProps,
    mapDispatchToProps,
)(PersonalModeLobby);

export {
    ConnectedPersonalModeLobby as PersonalModeLobby,
};
