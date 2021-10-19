// @flow

import { toState } from '../base/redux';

const ETHERPAD_OPTIONS = {
    showControls: 'true',
    showChat: 'false',
    showLineNumbers: 'true',
    useMonospaceFont: 'false'
};

/**
 * Retrieves the current sahred document URL.
 *
 * @param {Function|Object} stateful - The redux store or {@code getState} function.
 * @returns {?string} - Current shared document URL or undefined.
 */
export function getSharedDocumentUrl(stateful: Function | Object) {
    const state = toState(stateful);
    const { documentUrl } = state['features/etherpad'];

    return documentUrl;
}

/**
 * Generates a URL for the simulation.
 *
 * @param {string} baseUrl - The base URL / hosted location of the simulation.
 * @param {string} roomName - The name of the jitsi room the participant is joining / joined.
 * @param {string} displayName - The display name of the participant.
 * @param {string} userId - The riff ID of the participant.
 *
 * @returns {string} The URL to embed.
 */
export function generateSimulationUrl(baseUrl: string, roomName: string, displayName: string, userId: string) {
    const url = new URL(baseUrl);

    url.searchParams.set('room', roomName);
    url.searchParams.set('display_name', displayName);
    url.searchParams.set('uid', userId);

    return url.toString();
}

/**
 * Generates a URL to embed the appropriate etherpad document.
 *
 * @param {string} baseUrl - The base URL / hosted location of etherpad.
 * @param {string} roomName - The name of the jitsi room the participant is joining / joined.
 * @param {string} displayName - The display name of the participant.
 *
 * @returns {string} The URL to embed.
 */
export function generateEtherpadUrl(baseUrl: string, roomName: string, displayName: string) {
    const url = new URL(roomName, baseUrl);
    const params = new URLSearchParams(ETHERPAD_OPTIONS);

    params.append('userName', displayName);
    url.search = params.toString();

    return url.toString();
}
