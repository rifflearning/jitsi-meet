/* ******************************************************************************
 * user.js                                                                      *
 * *************************************************************************/ /**
 *
 * @fileoverview Selectors to access user settings
 *
 * Created on       February 13, 2020
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2020-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import { AuthTypes } from '../constants';

/* ******************************************************************************
 * getUserId                                                               */ /**
 *
 * Get the ID of the logged in user, or null.
 *
 * @param {Object} state
 * @returns {?string}
 */
function getUserId(state) {
    return APP.store.getState()['features/base/participants'][0]?.id || '';
    return state.user.uid;
}

/* ******************************************************************************
 * getUserEmail                                                            */ /**
 *
 * Get the email address of the logged in user, or empty string.
 *
 * @param {Object} state
 * @returns {string}
 */
function getUserEmail(state) {
    return APP.store.getState()['features/base/participants'][0]?.email || '';
    return state.user.email;
}

/* ******************************************************************************
 * getUserName                                                             */ /**
 *
 * Get the name of the logged in user, or null.
 *
 * @param {Object} state
 * @returns {string}
 */
function getUserName(state) {
    return APP.store.getState()['features/base/participants'][0]?.name || '';
    return state.user.name;
}

/* ******************************************************************************
 * getUserRoomName                                                         */ /**
 *
 * Get the personal room name of the logged in user, or null.
 *
 * @param {Object} state
 * @returns {string}
 */
function getUserRoomName(state) {
    return null;
    return state.user.roomName;
}

/* ******************************************************************************
 * getUserRoomId                                                           */ /**
 *
 * Get the ID of the personal room of the logged in user, or null.
 *
 * @param {Object} state
 * @returns {string}
 */
function getUserRoomId(state) {
    return null;
    return state.user.roomId;
}

/* ******************************************************************************
 * getUserAuthType                                                         */ /**
 *
 * Get the authorization type of the logged in user. If no user is logged in
 * the returned value will be a valid but irrelevant AuthType
 *
 * @param {Object} state
 * @returns {AuthTypes}
 */
function getUserAuthType(state) {
    return AuthTypes.Firebase;
    return state.user.authType;
}

/* ******************************************************************************
 * getIsUserLoggedIn                                                       */ /**
 *
 * Determine if a user is currently logged in or not.
 *
 * @param {Object} state
 * @returns {boolean}
 */
function getIsUserLoggedIn(state) {
    return getUserAuthType(state) !== AuthTypes.None;
}

/* ******************************************************************************
 * getCanUserBeInvited                                                     */ /**
 *
 * Determine if the current user can be invited to a meeting via url parameters.
 * Only firebase users can be invited in this way, but if there is no logged
 * in user they may be invited but will have to login as a firebase user first.
 *
 * @param {Object} state
 * @returns {boolean}
 */
function getCanUserBeInvited(state) {
    const authType = getUserAuthType(state);
    return authType === AuthTypes.Firebase || authType === AuthTypes.None;
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    getCanUserBeInvited,
    getIsUserLoggedIn,
    getUserAuthType,
    getUserEmail,
    getUserId,
    getUserName,
    getUserRoomId,
    getUserRoomName,
};
