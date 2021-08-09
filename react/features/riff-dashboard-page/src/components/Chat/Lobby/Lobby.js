/* ******************************************************************************
 * Lobby.jsx                                                                    *
 * *************************************************************************/ /**
 *
 * @fileoverview React component for the Chat Lobby
 *
 * Presents the user with a page in which they can verify their
 * microphone & camera are working and join (or start) a meeting.
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

import { getIsPersonalMode } from 'Redux/selectors/config';

import { LobbyContainer } from './styled';
import { LobbySidebar } from './LobbySidebar';
import { PersonalModeLobby } from './PersonalModeLobby';
import { TeamsModeLobby } from './TeamsModeLobby';


class Lobby extends React.Component {
    static propTypes = {

        /** webrtc object for interacting with simplewebrtc client */
        webrtc: PropTypes.object,

        /** mute or unmute the user's mic */
        handleMuteMicClick: PropTypes.func,

        /** either joins an ongoing meeting or starts a new one */
        joinMeeting: PropTypes.func.isRequired,
    };

    render() {
        let lobbyBody;
        if (getIsPersonalMode()) {
            lobbyBody = (
                <PersonalModeLobby
                    joinMeeting={this.props.joinMeeting}
                    webrtc={this.props.webrtc}
                />
            );
        }
        else {
            lobbyBody = (
                <TeamsModeLobby
                    joinMeeting={this.props.joinMeeting}
                    webrtc={this.props.webrtc}
                />
            );
        }

        return (
            <LobbyContainer>
                <Helmet>
                    <title>{'Chat'}</title>
                </Helmet>
                <div className='inner'>
                    <LobbySidebar
                        handleMuteMicClick={this.props.handleMuteMicClick}
                        webrtc={this.props.webrtc}
                    />
                    {lobbyBody}
                </div>
            </LobbyContainer>
        );
    }
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    Lobby,
};
