/* ******************************************************************************
 * UserWebcam.jsx                                                               *
 * *************************************************************************/ /**
 *
 * @fileoverview React component for the user's webcam
 *
 * Displays the user's webcam.
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

import { logger } from 'libs/utils';

import { USER_WEBCAM_ID } from './constants';

import { LocalVideoContainer } from './styled';

class UserWebcam extends React.Component {
    static propTypes = {
        webrtc: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.reattachVideo = this.reattachVideo.bind(this);
    }

    reattachVideo(video) {
        // we have to reattach the video source to the DOM
        // when the user transitions from screen sharing
        // back to regular video chatting

        if (video === null || video === undefined) {
            return;
        }

        try {
            // FIXME same as above
            if (
                (video.srcObject === null || video.srcObject === undefined) &&
                this.props.webrtc &&
                this.props.webrtc.webrtc.localStreams.length
            ) {
                // this is a simplewebrtc function that will
                // reattach the webcam source to the provided DOM element
                this.props.webrtc.reattachLocalVideo(video);
            }
        }
        catch (err) {
            // it is possible webrtc state will change while re-rendering,
            // which can break things in a few different ways
            // we catch the exceptions here so we can recover
            logger.debug(err);
        }
    }

    render() {
        return (
            <LocalVideoContainer id='local-video-container'>
                <video
                    className='local-video'
                    id={USER_WEBCAM_ID}
                    height='192'
                    width='256'
                    ref={this.reattachVideo}
                    aria-label='My video feed'
                />
                <canvas
                    id='video-overlay'
                    height='192'
                    width='256'
                    style={{ display: 'none' }}
                />
            </LocalVideoContainer>
        );
    }
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    UserWebcam,
};
