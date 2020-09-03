/* ******************************************************************************
 * index.js                                                                     *
 * *************************************************************************/ /**
 *
 * @fileoverview Connects MeetingSidebarComponent to redux
 *
 * @author          Jordan Reedie
 *
 * @copyright (c) 2019-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import { connect } from 'react-redux';

import { getDisplayName, getRoomName } from 'Redux/selectors/chat';

import { MeetingSidebar } from './MeetingSidebar';

const mapStateToProps = state => ({
    displayName: getDisplayName(state),
    roomName: getRoomName(state),
    webRtcPeers: state.chat.webRtcPeers[0] === null ? [] : state.chat.webRtcPeers,
    isMicMuted: state.chat.audioMuted,
});

const ConnectedMeetingSidebar = connect(mapStateToProps)(MeetingSidebar);


/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    ConnectedMeetingSidebar as MeetingSidebar,
};
