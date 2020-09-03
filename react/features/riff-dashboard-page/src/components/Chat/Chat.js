/* ******************************************************************************
 * Chat.jsx                                                                     *
 * *************************************************************************/ /**
 *
 * @fileoverview React component for the Chat page
 *
 * The Chat page initially presents a 'Lobby' where the user can verify that
 * the audio and video are working before joining (or starting) a webrtc meeting.
 *
 * After joining or starting a meeting, the 'Meeting' page is displayed,
 * where the user will be able to see & hear anyone else who joins the meeting.
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

import { unMuteAudio } from 'redux/actions/chat';
import { store } from 'redux/store';
import { addWebRtcListeners } from 'redux/listeners/webrtc';
import { logger } from 'libs/utils';

import { ChatContainer } from './styled';
import { Lobby } from './Lobby';
import { Meeting } from './Meeting';
import { USER_WEBCAM_ID } from './Common/constants';

class Chat extends React.Component {

    static propTypes = {

        /** either joins an ongoing meeting or starts a new one */
        joinMeeting: PropTypes.func.isRequired,

        /** React's dispatch function */
        dispatch: PropTypes.func.isRequired,

        /** mute or unmute the user's mic */
        toggleMicOnOff: PropTypes.func.isRequired,

        /** true if a user is currently in a meeting, false otherwise */
        inRoom: PropTypes.bool.isRequired,

        /** the name of the room the user is in */
        roomName: PropTypes.string.isRequired,

        /** the current user's email */
        email: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            webrtc: null,
        };

        this.toggleMicOnOff = this.toggleMicOnOff.bind(this);
    }

    componentDidMount() {
        const localVideoId = USER_WEBCAM_ID;
        // we do this after the component mounts because
        // the simplewebrtc initialization needs to hook into
        // the DOM and get the video element the user's webcam
        // will get dumped into
        const webrtc = addWebRtcListeners(
            this.props.email,
            localVideoId,
            this.props.dispatch,
            store.getState);

        // this will cause a double render, but that's fine.
        // eslint-disable-next-line react/no-did-mount-set-state
        this.setState({ webrtc: webrtc });

        logger.debug('> webrtc connection ID:',
                     webrtc.connection.connection.id);

        // reset audio
        // FIXME should probably be a single function call here
        this.props.dispatch(unMuteAudio());
        webrtc.unmute();
    }

    componentWillUnmount() {
        this.state.webrtc.releaseWebcam();
    }

    render() {
        let content;

        // there are two main rendering paths - either the user is in a room,
        // or they are not
        // if they are in the room, we want them to join the meeting
        // if they are not, we take them to the lobby where they can
        // join or start a meeting
        if (this.props.inRoom) {
            content = (
                <Meeting
                    webrtc={this.state.webrtc}
                    handleMuteMicClick={this.toggleMicOnOff}
                    roomName={this.props.roomName}
                />
            );
        }
        else {
            content = (
                <Lobby
                    webrtc={this.state.webrtc}
                    joinMeeting={this.props.joinMeeting}
                    handleMuteMicClick={this.toggleMicOnOff}
                />
            );
        }

        return (
            <ChatContainer>
                {content}
            </ChatContainer>
        );
    }

    toggleMicOnOff(muted) {
        // NOTE - currently keeping this at the top level because
        // it's used in both Lobby and Meeting
        // worth considering if we even need to be able to mute in Lobby
        // - jr 6.18.19

        // we can only mute if webrtc has been set up, if it hasn't do nothing
        if (this.state.webrtc === null) {
            return;
        }

        // This function requires a valid webrtc
        this.props.toggleMicOnOff(muted, this.state.webrtc);
    }
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    Chat,
};
