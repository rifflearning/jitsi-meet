/* ******************************************************************************
 * riff.js                                                                      *
 * *************************************************************************/ /**
 *
 * @fileoverview Selectors to access riff settings
 *
 * Created on       March 23, 2020
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2020-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

/* ******************************************************************************
 * getIsRiffConnected                                                      */ /**
 *
 * Determine if the riffdata server is connected (we have authenticated with it).
 *
 * @param {Object} state
 * @returns {string}
 */
function getIsRiffConnected(state) {
    return Boolean(getRiffAuthToken(state));
}

/* ******************************************************************************
 * getRiffAuthToken                                                        */ /**
 *
 * Get the authentication token for connecting to the riffdata server.
 *
 * @param {Object} state
 * @returns {string}
 */
function getRiffAuthToken(state) {
    return state.riff.authToken;
}

/* ******************************************************************************
 * getRiffMeetingId                                                        */ /**
 *
 * Get the id of the current active meeting.
 *
 * @param {Object} state
 * @returns {string}
 */
function getRiffMeetingId(state) {
    return state.riff.meetingId;
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    getIsRiffConnected,
    getRiffAuthToken,
    getRiffMeetingId,
};
