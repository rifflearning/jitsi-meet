/* ******************************************************************************
 * LobbySidebar.jsx                                                             *
 * *************************************************************************/ /**
 *
 * @fileoverview React component for the Lobby Sidebar
 *
 * Displays the user's webcam & microphone activity to help them get
 * ready to join a meeting
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

import { UserVideo } from 'components/Chat/Common/UserVideo';
import {
    LocalMediaSidebar,
    SidebarBottomContainer,
    SignedInAs,
} from 'components/Chat/Common/styled';

import { MicActivityBar } from './MicActivityBar';
import { ScreenShareWarning } from './ScreenShareWarning';
import { VideoPlaceholder } from './VideoPlaceholder';

class LobbySidebar extends React.Component {
    static propTypes = {

        /** true if there is an error requesting access to  the user's
         *  webcam or microphone
         *  false otherwise
         */
        mediaError: PropTypes.bool,

        /** webrtc object for interacting with simplewebrtc client */
        webrtc: PropTypes.object,

        /** true if the user's mic is muted, false otherwise */
        isMicMuted: PropTypes.bool.isRequired,

        /** current volume of the user's microphone */
        volume: PropTypes.number.isRequired,

        /** mute or unmute the user's mic */
        handleMuteMicClick: PropTypes.func.isRequired,

        /** the user's display name */
        displayName: PropTypes.string,
    };

    render() {
        let video;
        if (this.props.mediaError) {
            video = <VideoPlaceholder/>;
        }
        else {
            video = <UserVideo webrtc={this.props.webrtc}/>;
        }

        // If there is no display name, then show "Anonymous"
        let displayName = <span className='anonymous'>{'Anonymous'}</span>;
        if (this.props.displayName) {
            displayName = <span>{this.props.displayName}</span>;
        }

        return (
            <LocalMediaSidebar>
                <SignedInAs>
                    <span>{'Signed in as'}</span>
                    {displayName}
                </SignedInAs>
                {video}
                <MicActivityBar
                    handleMuteMicClick={this.props.handleMuteMicClick}
                    isMicMuted={this.props.isMicMuted}
                    volume={this.props.volume}
                />

                <SidebarBottomContainer>
                    <p>
                        {'Make sure Riff has access to your webcam and microphone.'}
                        {' You can\'t join a video call without them.'}
                    </p>
                    <ScreenShareWarning/>
                </SidebarBottomContainer>
            </LocalMediaSidebar>
        );
    }
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    LobbySidebar,
};
