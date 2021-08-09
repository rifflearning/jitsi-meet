/* ******************************************************************************
 * actiontypes.js                                                               *
 * *************************************************************************/ /**
 *
 * @fileoverview Enumeration of all redux action types
 *
 * This file is currently named actiontypes-new.js so that the action types can
 * be *slowly* migrated from the current ActionTypes.js file.
 * It is imported/exported by the index.js while the current ActionTypes.js
 * is imported directly.
 *
 * Created on       March 17, 2020
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2020-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

/**
 * All redux action types
 * @enum {string}
 */
const ActionTypes = keyMirror({
    /** User action types */
    USER_LOGIN_SUCCESS: null,
    USER_LOGOUT: null,
    USER_INFO_UPDATE: null,

    /** Chat action types */
    CHAT_MEETING_JOIN: null,
    CHAT_MEETING_LEAVE: null,
    CHAT_POST_MEETING_SURVEY_DISMISS: null,
    CHAT_POST_MEETING_SURVEY_GIVE: null,
    CHAT_CHANGE_ROOM_ID: null,
    CHAT_SET_INVITE_ID: null,

    /** Navbar Menu action types */
    MENU_TOGGLE_VIEW: null,

    /** Dashboard action types */
    DASHBOARD_FETCH_MEETING_AFFIRMATIONS: null,
    DASHBOARD_FETCH_MEETING_INFLUENCE: null,
    DASHBOARD_FETCH_MEETING_INTERRUPTIONS: null,
    DASHBOARD_FETCH_MEETING_STATS: null,
    DASHBOARD_FETCH_MEETING_TIMELINE: null,
    DASHBOARD_FETCH_MEETINGS: null,
    DASHBOARD_GRAPH_LOADED: null,
    DASHBOARD_SELECT_MEETING: null,

    /** Riffdata action types */
    RIFFDATA_AUTH_REQUEST: null,
    RIFFDATA_AUTH_SUCCESS: null,
    RIFFDATA_AUTH_FAILURE: null,
});

/** enum of possible request statuses (lifted from mattermost-redux, removed unused CANCELLED) */
const RequestStatus = {
    /** initial status prior to any request */
    NOT_STARTED: 'not_started',

    /** status when request is issued */
    STARTED: 'started',

    /** status when request has been successfully completed */
    SUCCESS: 'success',

    /** status when request has failed for any reason */
    FAILURE: 'failure',
};

/**
 * Constructs an enumeration with keys equal to their value.
 *
 * For example:
 *
 *   var COLORS = keyMirror({blue: null, red: null});
 *   var myColor = COLORS.blue;
 *   var isColorValid = !!COLORS[myColor];
 *
 * The last line could not be performed if the values of the generated enum were
 * not equal to their keys.
 *
 *   Input:  {key1: val1, key2: val2}
 *   Output: {key1: key1, key2: key2}
 *
 * @param {object} obj
 * @returns {object}
 */
function keyMirror(obj) {
    if (!(obj instanceof Object && !Array.isArray(obj))) {
        throw new Error('keyMirror(...): Argument must be an object.');
    }

    const ret = {};
    for (const key of Object.keys(obj)) {
        ret[key] = key;
    }
    return ret;
}


/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    ActionTypes,
    RequestStatus,
};
