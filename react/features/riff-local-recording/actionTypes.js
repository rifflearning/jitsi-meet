/**
 * Action to signal that the local client has started to perform recording,
 * (as in: {@code RecordingAdapter} is actively collecting audio data).
 *
 * @type LOCAL_RECORDING_ENGAGED,
 */
export const LOCAL_RECORDING_ENGAGED = 'LOCAL_RECORDING_ENGAGED';

/**
 * Action to signal that the local client has stopped recording,
 * (as in: {@code RecordingAdapter} is no longer collecting audio data).
 *
 * @type LOCAL_RECORDING_UNENGAGED
 * {
 *     type: LOCAL_RECORDING_UNENGAGED
 * }
 */
export const LOCAL_RECORDING_UNENGAGED = 'LOCAL_RECORDING_UNENGAGED';

/**
 * Action to set stats from all clients.
 *
 * @type LOCAL_RECORDING_STATS,
 */
export const LOCAL_RECORDING_STATS = 'LOCAL_RECORDING_STATS';

export const LOCAL_RECORDING_SET_SHARED_VIDEO_ID = 'LOCAL_RECORDING_SET_SHARED_VIDEO_ID';

