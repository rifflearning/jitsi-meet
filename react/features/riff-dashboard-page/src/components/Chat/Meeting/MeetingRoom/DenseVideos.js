/* ******************************************************************************
 * DenseVideos.jsx                                                              *
 * *************************************************************************/ /**
 *
 * @fileoverview React component to display incoming video streams while leaving
 * space to display other content on the page
 *
 * Display up to four (potentially more, but no guarantees)
 * videos in a single vertical stack
 *
 * Created on       September 11, 2019
 * @author          Jordan Reedie
 *
 * @copyright (c) 2018-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/
import React from 'react';
import PropTypes from 'prop-types';

import { calculateVideoHeight, mapPeersToVideos } from 'components/Chat/Common/utils';

class DenseVideos extends React.Component {
    static propTypes = {

        /** list of all webrtc peers */
        peers: PropTypes.arrayOf(PropTypes.object),
    };

    render() {
        const peers = this.props.peers;
        const videoHeight = calculateVideoHeight(peers.length);
        const peerVideos = mapPeersToVideos(peers, videoHeight);
        const formattedPeerVideos = peerVideos.map((peerVideo, i) => (
            <div className='tile' key={peers[i].nick}>
                {peerVideo}
            </div>
        ));

        return (
            <div className='tile is-ancestor'>
                <div className='tile is-parent is-vertical'>
                    {formattedPeerVideos}
                </div>
            </div>
        );
    }
}

export {
    DenseVideos
};
