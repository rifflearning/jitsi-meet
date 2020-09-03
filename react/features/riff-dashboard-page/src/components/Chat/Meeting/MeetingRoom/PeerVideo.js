/* ******************************************************************************
 * PeerVideo.jsx                                                                *
 * *************************************************************************/ /**
 *
 * @fileoverview React component for Peer video streams
 *
 * Add a peer's video to the DOM.
 *
 * Created on       January 17, 2019
 * @author          Jordan Reedie
 *
 * @copyright (c) 2019-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/
import React from 'react';
import PropTypes from 'prop-types';

import { logger } from 'libs/utils';

import { PeerVideoContainer } from '../styled';

import { PeerLabel } from './PeerLabel';

class PeerVideo extends React.Component {
    static propTypes = {

        /** the id of the peer whose video stream we are rendering */
        id: PropTypes.string,

        /** the color associated with this peer in the meeting mediator */
        peerColor: PropTypes.string.isRequired,

        /** the type of video we are rendering (peer or screen) */
        type: PropTypes.oneOf([ 'peer', 'screen' ]).isRequired,

        /** the user's display name */
        displayName: PropTypes.string,

        /** the video element we are displaying */
        video: PropTypes.instanceOf(Element),

        /** the desired height of the video element
         *   can be pixels, percentage, vh
         */
        videoHeight: PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.appendVideo = this.appendVideo.bind(this);
    }

    appendVideo(el) {
        // this can happen if webrtc state changes while we are re-rendering
        if (el === null || el === undefined) {
            return;
        }

        logger.debug('appending?', 'color:', this.props.peerColor);

        if (this.props.type === 'peer') {
            // we don't want to clip any of the shared screen,
            // so only apply this to peers
            this.props.video.style.setProperty('object-fit', 'cover');
        }
        el.appendChild(this.props.video);
        this.props.video.play();
    }

    render() {
        let peerLabel = null;
        // we don't want to add the label for screen sharing,
        // so only add it to peer videos
        if (this.props.type === 'peer') {
            peerLabel = (
                <PeerLabel
                    displayName={this.props.displayName}
                    peerColor={this.props.peerColor}
                />
            );
        }

        return (
            <PeerVideoContainer
                id={'container_' + this.props.id}
                ref={this.appendVideo}
                videoHeight={this.props.videoHeight}
                className='peer-video-container'
            >
                {peerLabel}
            </PeerVideoContainer>
        );
    }
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    PeerVideo,
};
