/* ******************************************************************************
 * chat.js                                                                      *
 * *************************************************************************/ /**
 *
 * @fileoverview Selectors to access chat (meeting) settings
 *
 * Created on       February 13, 2020
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2020-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/
import { getUserId } from 'redux/selectors/user';
import { getIsPersonalMode, getMeetingSettings } from 'redux/selectors/config';
import { convertYoutubeToEmbedLink } from 'libs/utils/url_utils';

/* ******************************************************************************
 * getRoomName                                                             */ /**
 *
 * Get the room name for the meeting.
 *
 * @param {Object} state
 * @returns {string}
 */
function getRoomName(state) {
    return state.chat.roomName || '';
}

/* ******************************************************************************
 * getRoomId                                                               */ /**
 *
 * Get the room id for the meeting, null if not set
 * Only used in personal mode. If not in personal mode, will always return null
 *
 * @param {Object} state
 * @returns {string}
 */
function getRoomId(state) {
    if (!getIsPersonalMode()) {
        return null;
    }

    return state.chat.roomId;
}

/* ******************************************************************************
 * getWasInvited                                                           */ /**
 *
 * Did the user navigate to the webapp through an invite?
 * Only used in personal mode. If not in personal mode, will return null
 *
 * @param {Object} state
 * @returns {boolean}
 */
function getWasInvited(state) {
    if (!getIsPersonalMode()) {
        return null;
    }

    // state.chat.inviteId is always null if the user was not invited,
    // and always truthy if they were
    return Boolean(state.chat.inviteId);
}

/* ******************************************************************************
 * getInviteId                                                             */ /**
 *
 * If the user was invited, return the invite ID, otherwise null
 * Only used in personal mode. If not in personal mode, will return null
 *
 * @param {Object} state
 * @returns {string}
 */
function getInviteId(state) {
    if (!getIsPersonalMode()) {
        return null;
    }

    // state.chat.inviteId is always null if the user was not invited,
    // and always truthy if they were
    return state.chat.inviteId;
}

/* ******************************************************************************
 * getIsHost                                                               */ /**
 *
 * Is the current user the host of the meeting they are trying to join?
 * Only used in personal mode. If not in personal mode, will return null
 *
 * @param {Object} state
 * @returns {boolean}
 */
function getIsHost(state) {
    if (!getIsPersonalMode()) {
        return null;
    }

    // make sure both have values before comparing,
    // otherwise we could end up with false positives
    if (state.user.roomId && state.chat.roomId) {
        return state.user.roomId === state.chat.roomId;
    }

    return false;
}

/* ******************************************************************************
 * getIsRoomNameUserSettable                                               */ /**
 *
 * Determine if the user should be able to change the meeting room name.
 *
 * @param {Object} state
 * @returns {boolean}
 */
function getIsRoomNameUserSettable(state) {
    return state.chat.isRoomNameUserSettable;
}

/* ******************************************************************************
 * getDisplayName                                                          */ /**
 *
 * Get the user's display name for the meeting.
 *
 * Prefer user-entered display name, then user account name, then empty string
 *
 * @param {Object} state
 * @returns {string}
 */
function getDisplayName(state) {
    return state.chat.displayName || state.user.name || '';
}

/* ******************************************************************************
 * getIsDisplayNameUserSettable                                            */ /**
 *
 * Determine if the user should be able to change their meeting display name.
 *
 * @param {Object} state
 * @returns {boolean}
 */
function getIsDisplayNameUserSettable(state) {
    return state.chat.isDisplayNameUserSettable;
}

/* ******************************************************************************
 * getSharedUrl                                                            */ /**
 *
 * Get the appropriate shared URL based on our configuration. Does any URL
 * manipulation that may be necessary to properly display the shared page
 *
 * @param {Object} state
 * @returns {string}
 */
function getSharedUrl(state) {
    const mtgSettings = getMeetingSettings();
    if (mtgSettings.useConfigDoc) {
        return getMeetingDocUrl(state);
    }

    // if the url is null, just send it back
    if (state.chat.sharedUrl === null) {
        return state.chat.sharedUrl;
    }

    let url;
    try {
        url = new URL(state.chat.sharedUrl);
    }
    catch (err) {
        return null;
    }

    // if the user sends a youtube link, we want to convert it to embed link
    const matchYoutube = /(youtube\.com|youtu\.be)$/;
    if (matchYoutube.test(url.hostname)) {
        return convertYoutubeToEmbedLink(url.href);
    }

    return url.href;
}

/* ******************************************************************************
 * getMeetingDocUrl                                                        */ /**
 *
 * Get the url for the meeting doc when it is of type 'url'. Return value is
 * indeterminate if the meeting doc type is anything else.
 *
 * @param {Object} state
 * @returns {string}
 */
function getMeetingDocUrl(state) {
    const supportedParams = {
        uid: getUserId(state),
        room: getRoomName(state),
        display_name: getDisplayName(state),
    };

    const url = new URL(getMeetingSettings().docUrl, window.location.href);
    for (const paramName of getMeetingSettings().docUrlParams) {
        if (paramName in supportedParams) {
            url.searchParams.set(paramName, supportedParams[paramName]);
        }
    }

    return url.href;
}

/* ******************************************************************************
 * getIsPostMeetingSurveyRequested                                         */ /**
 *
 * Determine if the post meeting survey has bee requested to be given to the user.
 *
 * @param {Object} state
 * @returns {boolean}
 */
function getIsPostMeetingSurveyRequested(state) {
    // It is requested if the value is a meeting Id and not an empty string.
    return Boolean(state.chat.givePostMeetingSurvey);
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    getDisplayName,
    getInviteId,
    getIsDisplayNameUserSettable,
    getIsPostMeetingSurveyRequested,
    getIsRoomNameUserSettable,
    getMeetingDocUrl,
    getRoomName,
    getRoomId,
    getIsHost,
    getSharedUrl,
    getWasInvited,
};
