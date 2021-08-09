/* ******************************************************************************
 * MicMuteButton.jsx                                                            *
 * *************************************************************************/ /**
 *
 * @fileoverview React component for the microphone mute button
 *
 * If the button is clicked, it does the following:
 *  - if the user is currently muted, it unmutes the user
 *  - if the user is *not* currently muted, it mutes the user
 *
 * Created on       May 13, 2019
 * @author          Jordan Reedie
 *
 * @copyright (c) 2019-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/
import React from 'react';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import PropTypes from 'prop-types';

import { MediaActionBtn } from './styled';

class MicMuteButton extends React.Component {
    static propTypes = {

        /** true if the user's mic is muted, false otherwise */
        isMicMuted: PropTypes.bool.isRequired,

        /** mute or unmute the user's mic */
        handleMuteMicClick: PropTypes.func.isRequired,
    };

    render() {
        let icon = <MicIcon/>;

        if (this.props.isMicMuted) {
            icon = <MicOffIcon/>;
        }

        const onClick = (/* event */) => this.props.handleMuteMicClick(this.props.isMicMuted);

        return (
            <MediaActionBtn
                inToggledState={this.props.isMicMuted}
                onClick={onClick}
                aria-label={`Turn microphone ${this.props.isMicMuted ? 'on' : 'off'}`}
            >
                {icon}
            </MediaActionBtn>
        );
    }
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    MicMuteButton,
};
