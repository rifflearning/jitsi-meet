/* ******************************************************************************
 * index.js                                                                     *
 * *************************************************************************/ /**
 *
 * @fileoverview Connects Lobby to redux
 *
 * Created on       June 8, 2019
 * @author          Jordan Reedie
 *
 * @copyright (c) 2019-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import { connect } from 'react-redux';

import {
    changeDisplayName,
    changeRoomName,
} from 'Redux/actions/chat';

import { Lobby } from './Lobby';

const mapDispatchToProps = dispatch => ({
    saveRoomName: (roomName) => {
        dispatch(changeRoomName({ roomName }));
    },
    saveDisplayName: (displayName) => {
        dispatch(changeDisplayName({ displayName }));
    },
});

const ConnectedLobby = connect(
    null,
    mapDispatchToProps
)(Lobby);

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    ConnectedLobby as Lobby,
};
