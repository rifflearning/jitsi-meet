/* global riffConfig */
import Sibilant from '@rifflearning/sibilant';

import { getRiffApp } from './riffClient';

let _detachSibilantFn = null;

/**
 * Returns an object containing all the state relevant
 * to Riff.
 *
 * @param {Object} state - The redux state object.
 * @returns {Object} - Object with relevant state. Contains:
 * {
 *     accessToken,
 *     displayName,
 *     meetingId,
 *     meetingTitle,
 *     participant,
 *     room
 * }
 */
function getRiffState(state) {
    const {
        accessToken,
        participantId: participant,
        meetingId,
        meetingTitle,
    } = state['features/riff-integration'];
    const { name: displayName } = state['features/base/settings'];
    const { room } = state['features/base/conference'];

    return {
        accessToken,
        displayName,
        meetingId,
        meetingTitle,
        participant,
        room,
    };
}

/**
 * Sends an utterance to the riff data server if the user is currently
 * in a meeting. If the user has yet to join or has left a meeting, drop it.
 *
 * @param {Object} data - The utterance data to send.
 * @param {Function} getState - Function to get the redux state.
 * @returns {void}
 */
async function sendUtteranceToRiffDataServer(data, getState) {
    const state = getState();
    const conference = state['features/base/conference'];
    const isUserInMeeting = conference !== undefined && conference.room !== null;

    if (!isUserInMeeting) {
        // this ensures we don't send any utterances before the user joins the meeting,
        // as well as after they leave the meeting (or if they have been kicked by a moderator)
        return;
    }

    const { accessToken: token, participant, room } = getRiffState(state);

    const volumes = riffConfig.metrics.sendUtteranceVolumes ? data.volumes : {};

    const app = getRiffApp();

    try {
        await app.service('utterances').create({
            participant,
            room,
            startTime: data.start.toISOString(),
            endTime: data.end.toISOString(),
            token,
            volumes,
        });
    } catch (error) {
        console.error('error sending utterance to data server!', error);
    }
}

/**
 * Attaches our VAD library sibilant to the given audio track. Detaches from existing
 * audio track first.
 *
 * @param {MediaTrack} audioTrack - The local audio track to attach to.
 * @param {Function} getState - Function to get the current redux state.
 *
 * @returns {void}
 */
function attachSibilant(audioTrack, getState) {
    detachSibilant();

    const sibilant = new Sibilant(new MediaStream([ audioTrack ]));
    const collectSpeechEvent = data => sendUtteranceToRiffDataServer(data, getState);

    sibilant.bind('stoppedSpeaking', collectSpeechEvent);

    _detachSibilantFn = () => sibilant.unbind('stoppedSpeaking', collectSpeechEvent);
}

/**
 * Unbind the current speech event listener, if we have one.
 *
 * @returns {void}
 */
function detachSibilant() {
    if (_detachSibilantFn) {
        _detachSibilantFn();
    }

    _detachSibilantFn = null;
}

export {
    attachSibilant,
    getRiffState,
};
