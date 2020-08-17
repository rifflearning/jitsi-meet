/* global APP */

import { MEDIA_TYPE } from './constants';


/**
 * Collects the list of all video streams that are not muted
 *
 * @returns {Array}
 */
export function getAllActiveVideoTracks() {
    return APP.store.getState()['features/base/tracks']
            .filter(track => track.mediaType === MEDIA_TYPE.VIDEO)
            .filter(track => !track.muted);
};
