/* ******************************************************************************
 * RemoteVideos.jsx                                                             *
 * *************************************************************************/ /**
 *
 * @fileoverview React component to display incoming video streams
 *
 *  Displays only incoming a/v streams from WebRtc peers
 *
 * Created on       August 9, 2018
 * @author          Dan Calacci
 * @author          Jordan Reedie
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2018-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/
import React from 'react';
import PropTypes from 'prop-types';

import { calculateVideoHeight, mapPeersToVideos } from 'components/Chat/Common/utils';
import { readablePeers } from 'libs/utils';

import { RemoteVideoRow } from '../styled';

class RemoteVideos extends React.Component {
    static propTypes = {

        /** list of all peers to display */
        peers: PropTypes.arrayOf(PropTypes.object).isRequired,
    };

    collectPeerVideos() {
        const otherPeerCnt = this.props.peers.length;
        // if we have less than three videos, we have only one row of videos
        // otherwise we have two
        const numRows = otherPeerCnt < 3 ? 1 : 2;
        const videoHeight = calculateVideoHeight(numRows);
        const peerVideos = mapPeersToVideos(this.props.peers, videoHeight, numRows);

        // if we only have one row, just return the videos
        if (numRows === 1) {
            return (<RemoteVideoRow>{peerVideos}</RemoteVideoRow>);
        }

        // number of videos to go on the top row
        const videosOnTop = Math.ceil(otherPeerCnt / 2);

        // if there is 1 less video in the 2nd row, add padding to make the
        // 2nd row videos the same width as the videos in the 1st row
        let row2Style = null;
        if (otherPeerCnt % 2 !== 0) {
            const hPaddingPct = Math.floor(100 / videosOnTop / 2);
            row2Style = { padding: `0 ${hPaddingPct}%` };
        }

        return (
            <>
                <RemoteVideoRow rowNum={1}>{peerVideos.slice(0, videosOnTop)}</RemoteVideoRow>
                <RemoteVideoRow rowNum={2} style={row2Style}>{peerVideos.slice(videosOnTop)}</RemoteVideoRow>
            </>
        );
    }

    render() {
        return (
            <div
                tabIndex='0'
                aria-label={`Video chat. ${readablePeers(this.props.peers)}`}
            >
                {this.collectPeerVideos()}
            </div>
        );
    }
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    RemoteVideos,
};
