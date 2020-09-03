/* ******************************************************************************
 * MeetingSidebar.jsx                                                           *
 * *************************************************************************/ /**
 *
 * @fileoverview React component for the Meeting Sidebar
 *
 * Displays the user's webcam, the display & room names,
 * the microphone mute button & screen share button,
 * and the Meeting Mediator
 *
 * Created on       May 13, 2019
 * @author          Jordan Reedie
 *
 * @copyright (c) 2019-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/
import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import { UserWebcam } from 'components/Chat/Common/UserWebcam';
import { MicMuteButton } from 'components/Chat/Common/MicMuteButton';

import {
    LocalMediaSidebar,
    SidebarBottomContainer,
    SignedInAs,
    VideoActionContainer,
} from 'components/Chat/Common/styled';

import { getMeetingSettings, getShowMeetingMediator } from 'redux/selectors/config';

import { MeetingMediator } from './MeetingMediator';
import { ScreenShareButton } from './ScreenShareButton';
import { ToggleDocButton } from './ToggleDocButton';
import { ShareUrlButton } from './ShareUrlButton';

class MeetingSidebar extends React.Component {
    static propTypes = {
        /** our webrtc object */
        webrtc: PropTypes.object.isRequired,

        /** the user's display name */
        displayName: PropTypes.string.isRequired,

        /** the name of the room the user is in */
        roomName: PropTypes.string.isRequired,

        /** true if the user's mic is currently muted, false otherwise */
        isMicMuted: PropTypes.bool.isRequired,

        /** handles muting and unmuting of the user's mic */
        handleMuteMicClick: PropTypes.func.isRequired,

        /** an array of all the Peer objects currently in the meeting */
        webRtcPeers: PropTypes.array.isRequired,
    };

    render() {

        // If there is no display name, then show "Anonymous"
        let displayName = <span className='anonymous'>{'Anonymous'}</span>;
        if (this.props.displayName) {
            displayName = <span>{this.props.displayName}</span>;
        }

        return (
            <LocalMediaSidebar>
                <Helmet>
                    <title>{this.props.roomName}</title>
                </Helmet>
                <SignedInAs>
                    <span>{'Signed in as'}</span>
                    {displayName}
                </SignedInAs>
                <UserWebcam webrtc={this.props.webrtc}/>
                <VideoActionContainer>
                    <MicMuteButton
                        isMicMuted={this.props.isMicMuted}
                        handleMuteMicClick={this.props.handleMuteMicClick}
                    />
                    {getMeetingSettings().useConfigDoc ? (
                        <ToggleDocButton/>
                    ) : (
                        <ShareUrlButton webrtc={this.props.webrtc}/>
                    )}
                    <ScreenShareButton webrtc={this.props.webrtc}/>
                </VideoActionContainer>
                <SidebarBottomContainer>
                    <MeetingMediator
                        displayName={this.props.displayName}
                        webRtcPeers={this.props.webRtcPeers}
                        isEnabled={getShowMeetingMediator()}
                    />
                </SidebarBottomContainer>
            </LocalMediaSidebar>
        );
    }
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    MeetingSidebar,
};
