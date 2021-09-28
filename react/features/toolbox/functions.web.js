// @flow

import { getToolbarButtons } from '../base/config';
import { hasAvailableDevices } from '../base/devices';
import { app } from '../riff-platform/libs/riffdata-client';

/**
 * Helper for getting the height of the toolbox.
 *
 * @returns {number} The height of the toolbox.
 */
export function getToolboxHeight() {
    const toolbox = document.getElementById('new-toolbox');

    return (toolbox && toolbox.clientHeight) || 0;
}

/**
 * Indicates if a toolbar button is enabled.
 *
 * @param {string} name - The name of the setting section as defined in
 * interface_config.js.
 * @param {Object} state - The redux state.
 * @returns {boolean|undefined} - True to indicate that the given toolbar button
 * is enabled, false - otherwise.
 */
export function isButtonEnabled(name: string, state: Object) {
    const toolbarButtons = getToolbarButtons(state);

    return toolbarButtons.indexOf(name) !== -1;
}

/**
 * Indicates if the toolbox is visible or not.
 *
 * @param {string} state - The state from the Redux store.
 * @returns {boolean} - True to indicate that the toolbox is visible, false -
 * otherwise.
 */
export function isToolboxVisible(state: Object) {
    const { iAmSipGateway } = state['features/base/config'];
    const {
        alwaysVisible,
        timeoutID,
        visible
    } = state['features/toolbox'];
    const { audioSettingsVisible, videoSettingsVisible } = state['features/settings'];

    return Boolean(!iAmSipGateway && (timeoutID || visible || alwaysVisible
        || audioSettingsVisible || videoSettingsVisible));
}

/**
 * Indicates if the audio settings button is disabled or not.
 *
 * @param {string} state - The state from the Redux store.
 * @returns {boolean}
 */
export function isAudioSettingsButtonDisabled(state: Object) {
    return (!hasAvailableDevices(state, 'audioInput')
        && !hasAvailableDevices(state, 'audioOutput'))
        || state['features/base/config'].startSilent;
}

/**
 * Indicates if the video settings button is disabled or not.
 *
 * @param {string} state - The state from the Redux store.
 * @returns {boolean}
 */
export function isVideoSettingsButtonDisabled(state: Object) {
    return !hasAvailableDevices(state, 'videoInput');
}

/**
 * Indicates if the video mute button is disabled or not.
 *
 * @param {string} state - The state from the Redux store.
 * @returns {boolean}
 */
export function isVideoMuteButtonDisabled(state: Object) {
    return !hasAvailableDevices(state, 'videoInput');
}

/**
 * Marks moment as interesting.
 *
 * @param {string} participantId - Id of the current user.
 * @param {string} roomId - Id of the room.
 * @returns {(function(*, *): Promise<{error: *}|undefined>)|*}
 */
export async function markInterestingMoment(participantId: String, roomId: String) {
    try {
        const time = new Date().toISOString();
        const meetings = await app.service('meetings')
            .find({
                query: {
                    active: true,
                    room: roomId
                }
            });

        const meetingId = meetings[0]._id;

        await app.service('moments').create({
            meetingId,
            participantId,
            time
        });
    } catch (error) {
        return { error };
    }
}
