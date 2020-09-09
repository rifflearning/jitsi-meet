/* ******************************************************************************
 * index.js                                                                     *
 * *************************************************************************/ /**
 *
 * @fileoverview Connects TeamsModeLobby to redux
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
} from 'Redux/actions/chat';
import { getUserEmail } from 'Redux/selectors/user';
import {
    getDisplayName,
    getIsDisplayNameUserSettable,
    getIsRoomNameUserSettable,
    getRoomName,
} from 'Redux/selectors/chat';

import { TeamsModeLobby } from './TeamsModeLobby';

const mapStateToProps = (state, ownProps) => ({
    displayName: getDisplayName(state),
    isDisplayNameUserSettable: getIsDisplayNameUserSettable(state),
    roomName: getRoomName(state),
    isRoomNameUserSettable: getIsRoomNameUserSettable(state),
    email: getUserEmail(state),
    isJoiningRoom: state.chat.joiningRoom,
    joinMeeting: (displayName, roomName, meetingType) => {
        ownProps.joinMeeting({
            displayName,
            roomName,
            meetingType,
            webrtc: ownProps.webrtc,
        });
    },
});

const mapDispatchToProps = dispatch => ({
    saveRoomName: (roomName) => {
        dispatch(changeRoomName({ roomName }));
    },
    saveDisplayName: (displayName) => {
        dispatch(changeDisplayName({ displayName }));
    },
});

const ConnectedTeamsModeLobby = connect(
    mapStateToProps,
    mapDispatchToProps
)(TeamsModeLobby);

export {
    ConnectedTeamsModeLobby as TeamsModeLobby,
};
