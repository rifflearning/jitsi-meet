/* ******************************************************************************
 * utils.js                                                                     *
 * *************************************************************************/ /**
 *
 * @fileoverview utility functions specific to the Chat component
 *
 * Created on       November 20, 2019
 * @author          Jordan Reedie
 *
 * @copyright (c) 2019-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import React from 'react';

import { WebRtcNick, getColorForOther } from 'libs/utils';

import { PeerVideo } from 'Components/Chat/Meeting/MeetingRoom/PeerVideo';

import { navHeight } from 'Components/styled';

import { MAX_VIDEO_CONTAINER_VH } from './constants';


/**
 * Calculates the height of an individual video based on the number
 * of rows they will be displayed in
 *
 * numRows is the number of videos stacked on top of each other
 *
 * returns a string (a calc expression for SASS to evaluate)
 */
function calculateVideoHeight(numRows) {
    // we should allocate 1vh to padding for each space between rows
    // to make sure we don't have videos overrunning each other
    const padding = numRows - 1;
    const allottedSpace = MAX_VIDEO_CONTAINER_VH - padding;
    // just divide the space up equally

    const vh = (allottedSpace / numRows) + 'vh';

    return `calc(${vh} - (${navHeight} / ${numRows}))`;
}

function mapPeersToVideos(peers, videoHeight) {
    const riffIds = peers.map(peer => WebRtcNick.getId(peer.nick)).sort();

    const peerObjToVideo = (peer) => {
        const [ riffId, displayName ] = WebRtcNick.getIdAndDisplayName(peer.nick);
        const idx = riffIds.indexOf(riffId);
        const color = getColorForOther(idx);

        return (
            <PeerVideo
                key={peer.id}
                id={peer.id}
                displayName={displayName}
                video={peer.videoEl}
                type='peer'
                peerColor={color}
                videoHeight={videoHeight}
            />
        );
    };

    return peers.map(peerObjToVideo);
}

export {
    calculateVideoHeight,
    mapPeersToVideos,
};
