/* ******************************************************************************
 * index.js                                                                     *
 * *************************************************************************/ /**
 *
 * @fileoverview React MeetingRoomComponent connected to the redux store
 *
 * Created on       June 11, 2019
 * @author          Jordan Reedie
 *
 * @copyright (c) 2019-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import { connect } from 'react-redux';

import { getSharedUrl } from 'redux/selectors/chat';

import { MeetingRoom } from './MeetingRoom';

const mapStateToProps = state => ({
    // FIXME - what's this check for?
    webRtcPeers: state.chat.webRtcPeers[0] === null ? [] : state.chat.webRtcPeers,
    sharedScreen: state.chat.sharedScreen,
    sharedUrl: getSharedUrl(state),
    shouldDisplayUrl: state.chat.shouldDisplayDoc,
});

const ConnectedMeetingRoom = connect(mapStateToProps)(MeetingRoom);

export {
    ConnectedMeetingRoom as MeetingRoom,
};
