/* global APP */

import { FEATURES } from './constants';


/**
 * Collects the list of all audio/video streams that are not muted
 *
 * @returns {Array}
 */
export function getAllActiveTracks(mediaType) {
    return APP.store.getState()[FEATURES.TRACKS]
            .filter(track => track.mediaType === mediaType)
            .filter(track => !track.muted);
};

/**
 * Returns userId associated with given participantId
 *
 * @returns {String}
 */
export function getUserIdByParticipantId(participantId) {
    const participant = APP.store.getState()[FEATURES.PARTICIPANTS].remote
            .get(participantId); 

    return participant.name.split(`|`)[0];
};

/**
 * Returns audio/video stream associated with given participantId
 *
 * @returns {MediaStream}
 */
export function getStreamByParticipantId(participantId, mediaType) {
    return APP.store.getState()[FEATURES.TRACKS]
            .filter(track => track.mediaType === mediaType)
            .find(track => track.participantId === participantId)
            .jitsiTrack.stream; 
};

/**
 * Returns meeting room name
 *
 * @returns {String}
 */
export function getRoom() {
    return APP.store.getState()[FEATURES.CONFERENCE].room; 
};

/**
 * Returns meeting room id
 *
 * @returns {String}
 */
export function getRoomId() {
    return APP.store.getState()[FEATURES.RIFF_PLATFORM].riff.roomId; 
};

/**
 * Collects a list of all participants with active streams
 *
 * @returns {Array}
 */
export function getParticipantsWithActiveStreams(mediaType) {
    return APP.store.getState()[FEATURES.TRACKS]
            .filter(track => track.mediaType === mediaType)
            .map(track => track.participantId);
};

/**
 * Returns an object that represents difference between
 * current participants in store and last known list of them
 *
 * @returns {Object}
 */
export function selectUpdatedParticipants(last, mediaType) {
    const current = getParticipantsWithActiveStreams(mediaType);

    return {
        left: last.filter(x => !current.includes(x)),
        joined: current.filter(x => !last.includes(x))
    }
};
