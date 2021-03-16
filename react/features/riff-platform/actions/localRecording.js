import {
    LOC_RECORDING_ENGAGED,
    LOC_RECORDING_STATS,
    LOC_RECORDING_SET_SHARED_VIDEO_ID
} from '../constants/actionTypes';

// The following action signals state changes in local recording engagement.

/**
 * Signals that local recording has been engaged.
 *
 * @param {Date} isEngaged - Local recording is engaged/unengaged.
 * @returns {{
 *     type: LOC_RECORDING_ENGAGED,
 *     isEngaged: boolean
 * }}
 */
export function localRecordingEngaged(isEngaged: Boolean) {
    return {
        type: LOC_RECORDING_ENGAGED,
        isEngaged
    };
}

/**
 * Local recording stats.
 *
 * @param {*} stats - The stats object.
 * @returns {{
 *     type: LOC_RECORDING_STATS_UPDATE,
 *     stats: Object
 * }}
 */
export function localRecordingStats(stats: Object) {
    return {
        type: LOC_RECORDING_STATS,
        stats
    };
}

/**
 * YouTube video id for add/remove user microphone with local recording.
 *
 * @param {string} id - The shared YouTube video id.
 * @returns {{
    *     type: LOC_RECORDING_SET_SHARED_VIDEO_ID,
    *     id: string
    * }}
    */
export function setSharedVideoId(id: string) {
    return {
        type: LOC_RECORDING_SET_SHARED_VIDEO_ID,
        id
    };
}
