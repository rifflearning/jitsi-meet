/* ******************************************************************************
 * index.js                                                                     *
 * *************************************************************************/ /**
 *
 * @fileoverview Connects LeaveRoomButtonComponent to redux
 *
 * Created on       June 5, 2019
 * @author          Jordan Reedie
 *
 * @copyright (c) 2019-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import { push } from 'connected-react-router';
import { connect } from 'react-redux';

import { participantLeaveRoom } from 'Redux/actions/riff';
import { givePostMeetingSurvey, leaveRoom, urlShareStop } from 'Redux/actions/chat';
import { getMeetingSettings } from 'Redux/selectors/config';
import { getRiffMeetingId } from 'Redux/selectors/riff';
import { getUserId } from 'Redux/selectors/user';
import { Routes } from 'Redux/constants';

import { LeaveRoomButton } from './LeaveRoomButton';

const mapStateToProps = state => ({
    meetingId: getRiffMeetingId(state),
    uid: getUserId(state),
    isUserSharing: state.chat.isUserSharing,
});

const mapDispatchToProps = dispatch => ({
    leaveRoom: (webrtc, meetingId, uid, isUserSharing) => {
        dispatch(leaveRoom());
        // this does not dispatch an action
        // this removes the participant from the meeting in riff-server
        participantLeaveRoom(meetingId, uid);
        // stop measuring speaking events
        webrtc.stopSibilant();
        // if the user is sharing, just call stopShareUrl
        // if they are sharing their screen, this call will do nothing
        // and their screen will be removed just by them leaving
        // URLs are not automatically unshared just by leaving,
        // so we need to do this here
        // - jr 3.25.20
        if (isUserSharing) {
            webrtc.stopShareUrl();
            dispatch(urlShareStop());
        }

        // make sure we tell webrtc we left so it emits an
        // appropriate event
        webrtc.leaveRoom();
        // stop the user's webcam
        webrtc.stopLocalVideo();

        if (getMeetingSettings().enablePostMeetingSurvey) {
            dispatch(givePostMeetingSurvey(meetingId));
        }

        dispatch(push(Routes.Metrics));
    },
});

const mapMergeProps = (stateProps, dispatchProps, ownProps) => ({
    // NOTE - we are intentionally not passing
    // stateProps, dispatchProps, or ownProps
    // to the component - they were only necessary for
    // the below function
    // - jr 7.26.2019
    leaveRoom: () => {
        dispatchProps.leaveRoom(
            ownProps.webrtc,
            stateProps.meetingId,
            stateProps.uid,
            stateProps.isUserSharing
        );
    },
});

const ConnectedLeaveRoomButton = connect(
    mapStateToProps,
    mapDispatchToProps,
    mapMergeProps)(LeaveRoomButton);

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    ConnectedLeaveRoomButton as LeaveRoomButton,
};
