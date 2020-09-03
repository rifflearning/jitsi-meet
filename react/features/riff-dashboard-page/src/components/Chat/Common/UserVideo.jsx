/* ******************************************************************************
 * UserVideo.jsx                                                                *
 * *************************************************************************/ /**
 *
 * @fileoverview React component for the user's local video stream
 *
 * Displays the stream that the user is currently sending to other peers.
 * If the user is not screen sharing, this is their webcam.
 * If the user is currently screen sharing, this is their shared screen.
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

import { UserWebcam } from './UserWebcam';
import { UserSharedScreen } from './UserSharedScreen';

class UserVideo extends React.Component {
    static propTypes = {
        sharedScreen: PropTypes.object,
        webrtc: PropTypes.object,
    };

    render() {
        if (this.props.sharedScreen) {
            return <UserSharedScreen screen={this.props.sharedScreen}/>;
        }

        return <UserWebcam webrtc={this.props.webrtc}/>;
    }

}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    UserVideo,
};
