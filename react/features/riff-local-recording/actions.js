/* @flow */

import {
    LOCAL_RECORDING_ENGAGED,
    LOCAL_RECORDING_UNENGAGED,
    LOCAL_RECORDING_STATS,
    LOCAL_RECORDING_SET_SHARED_VIDEO_ID
} from './actionTypes';

// The following two actions signal state changes in local recording engagement.
// In other words, the events of the local WebWorker / MediaRecorder starting to
// record and finishing recording.
// Note that this is not the event fired when the users tries to start the
// recording in the UI.

/**
 * Signals that local recording has been engaged.
 *
 * @returns {{
 *     type: LOCAL_RECORDING_ENGAGED,
 * }}
 */
export function localRecordingEngaged() {
    return {
        type: LOCAL_RECORDING_ENGAGED
    };
}

/**
 * Signals that local recording has finished.
 *
 * @returns {{
 *     type: LOCAL_RECORDING_UNENGAGED
 * }}
 */
export function localRecordingUnengaged() {
    return {
        type: LOCAL_RECORDING_UNENGAGED
    };
}

/**
 * Local recording stats.
 *
 * @param {*} stats - The stats object.
 * @returns {{
 *     type: LOCAL_RECORDING_STATS,
 *     stats: Object
 * }}
 */
export function localRecordingStats(stats) {
    return {
        type: LOCAL_RECORDING_STATS,
        stats
    };
}

/**
 * YouTube video id for add/remove user microphone with local recording.
 *
 * @param {string} id - The shared YouTube video id.
 * @returns {{
    *     type: LOCAL_RECORDING_SET_SHARED_VIDEO_ID,
    *     id: string
    * }}
    */
export function setSharedVideoId(id) {
    return {
        type: LOCAL_RECORDING_SET_SHARED_VIDEO_ID,
        id
    };
}
