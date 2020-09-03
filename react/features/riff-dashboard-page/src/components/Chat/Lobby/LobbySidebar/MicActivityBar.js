/* ******************************************************************************
 * MicActivityBar.jsx                                                           *
 * *************************************************************************/ /**
 *
 * @fileoverview React component to display microphone activity
 *
 * Displays the user's microphone activity to help them
 * verify that their microphone is working
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

import { MicMuteButton } from 'components/Chat/Common/MicMuteButton';

import { VideoActionContainer } from '../../Common/styled';

class MicActivityBar extends React.Component {
    static propTypes = {

        /** true if the user's mic is muted, false otherwise */
        isMicMuted: PropTypes.bool.isRequired,

        /** mute or unmute the user's mic */
        handleMuteMicClick: PropTypes.func.isRequired,

        /** current volume of the user's microphone */
        volume: PropTypes.number.isRequired
    };

    render() {
        return (
            <VideoActionContainer aria-label={`Your microphone is ${this.props.isMicMuted ? 'off' : 'on'}.`}>
                <div aria-label='volume'>
                    <MicMuteButton
                        isMicMuted={this.props.isMicMuted}
                        handleMuteMicClick={this.props.handleMuteMicClick}
                    />
                </div>
                <progress
                    value={this.props.isMicMuted ? 0 : this.props.volume}
                    max='100'
                />
            </VideoActionContainer>
        );
    }
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    MicActivityBar,
};
