/* ******************************************************************************
 * ScreenShareButton.jsx                                                        *
 * *************************************************************************/ /**
 *
 * @fileoverview React component for the screen share button
 *
 * If the button is clicked, it does the following:
 *  - if the user is currently sharing, it stops sharing
 *  - if someone else is currently sharing, it is disabled (and does nothing)
 *  - if no one is sharing, it starts the screen sharing process
 *
 * Created on       May 13, 2019
 * @author          Jordan Reedie
 *
 * @copyright (c) 2019-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/
import React from 'react';
import ScreenShareIcon from '@material-ui/icons/ScreenShare';
import StopScreenShareIcon from '@material-ui/icons/StopScreenShare';
import PropTypes from 'prop-types';

import { MediaActionBtn } from '../../../Common/styled';

class ScreenShareButton extends React.Component {
    static propTypes = {

        /**
         * if someone is sharing their screen, this will be truthy
         * if no one is sharing their screen, this will be falsy (null)
         */
        sharedScreen: PropTypes.object,

        /**
         * if someone is sharing a url, this will be truthy
         * if no one is sharing a url, this will be falsy (null)
         */
        sharedUrl: PropTypes.string,

        /** is the user currently sharing their screen? */
        isUserSharing: PropTypes.bool.isRequired,

        /** our webrtc object */
        webrtc: PropTypes.object.isRequired,

        /** handles both starting and stopping screen sharing */
        handleScreenShareClick: PropTypes.func.isRequired,
    };

    render() {
        let icon = <ScreenShareIcon/>;
        let disabled = false;
        let ariaLabel = 'Share Your Screen';
        const isSharing = this.props.isUserSharing && this.props.sharedScreen;
        if (isSharing) {
            icon = <StopScreenShareIcon/>;
            ariaLabel = 'Stop Sharing Your Screen';
        }
        else if (this.props.sharedScreen || this.props.sharedUrl) {
            disabled = true;
        }

        const onClick = () => this.props.handleScreenShareClick(
            this.props.isUserSharing,
            this.props.sharedScreen,
            this.props.sharedUrl,
            this.props.webrtc
        );

        return (
            <MediaActionBtn
                inToggledState={isSharing !== false}
                onClick={onClick}
                disabled={disabled}
                aria-label={ariaLabel}
                title={ariaLabel}
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
    ScreenShareButton,
};
