/**
 * The set of media types defined for streams
 */
export const MEDIA_TYPE = {
    AUDIO: "audio",
    VIDEO: "video"
};

export const MEDIA_TYPES = [
    MEDIA_TYPE.AUDIO,
    MEDIA_TYPE.VIDEO
];

/**
 * The set of params for frame captured from video stream 
 */
export const FRAME = {
    WIDTH: 720
};

/**
 * The set of features in global store
 */
export const FEATURES = {
    TRACKS: 'features/base/tracks',
    PARTICIPANTS: 'features/base/participants',
    CONFERENCE: 'features/base/conference',
    RIFF_PLATFORM: 'features/riff-platform'
}
