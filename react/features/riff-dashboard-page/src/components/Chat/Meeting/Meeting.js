/* ******************************************************************************
 * Meeting.jsx                                                                  *
 * *************************************************************************/ /**
 *
 * @fileoverview React component for the 'Meeting'
 *
 * This is displayed after a user joins a Meeting - displays the user's
 * webcam and meeting mediator in the sidebar, and the other meeting
 * participants' a/v streams in 'MeetingRoom'
 *
 * Created on       June 5, 2019
 * @author          Jordan Reedie
 *
 * @copyright (c) 2019-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/
import React from 'react';
import PropTypes from 'prop-types';

import riffLogo from 'Images/rifflogo.svg';

import { MeetingSidebar } from './MeetingSidebar';
import { MeetingRoom } from './MeetingRoom';
import { LeaveRoomButton } from './LeaveRoomButton';
import { CopyInviteButton } from './CopyInviteButton';

import {
    MeetingContainer,
    MeetingNavBar,
} from './styled';

class Meeting extends React.Component {
    static propTypes = {

        /** webrtc object for interacting with simplewebrtc client */
        webrtc: PropTypes.object.isRequired,

        /** mute or unmute the user's mic */
        handleMuteMicClick: PropTypes.func,

        /** the name of the room the user is in */
        roomName: PropTypes.string.isRequired,
    };

    render() {
        return (
            <>
                <MeetingNavBar>
                    <div className='left-container'>
                        <div className='riff-logo'>
                            <img alt={'Riff homepage'} src={riffLogo}/>
                        </div>
                        <div className='room-name-container'>
                            <i>{'💬'}</i>
                            <span className='room-name'>
                                {this.props.roomName}
                            </span>
                        </div>
                    </div>
                    <div className='action-btn-container'>
                        <CopyInviteButton/>
                        <LeaveRoomButton webrtc={this.props.webrtc}/>
                    </div>
                </MeetingNavBar>
                <MeetingContainer>
                    <MeetingSidebar
                        webrtc={this.props.webrtc}
                        handleMuteMicClick={this.props.handleMuteMicClick}
                    />
                    <MeetingRoom
                        setVideoBitrateLimit={bitrateLimit => this.props.webrtc.setVideoBitrateLimit(bitrateLimit)}
                    />
                </MeetingContainer>
            </>
        );
    }
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    Meeting,
};
