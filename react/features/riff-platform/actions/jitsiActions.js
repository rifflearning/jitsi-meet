/* global config, APP, process */
import ObjectID from 'bson-objectid';
import { createBrowserHistory } from 'history';

import UIEvents from '../../../../service/UI/UIEvents';
import { setTileView } from '../../video-layout';
import { attachSibilant, participantLeaveRoom } from '../actions/sibilantActions';
import api from '../api';
import RiffPlatform from '../components';
import * as actionTypes from '../constants/actionTypes';
import * as ROUTES from '../constants/routes';
import { isRiffPlatformCurrentPath, previousLocationRoomName } from '../functions';

import { checkIsMeetingAllowed } from './meeting';
import { logout } from './signIn';

const customHistory = createBrowserHistory();

// Navigate to jitsi app from riff-platform app or vice versa.
export const navigateWithoutReload = (component, route) => {
    if (route) {
        customHistory.push(route);
    }
    APP.store.getState()['features/base/app'].app._navigate({
        component,
        href: null
    });
};

/**
 * Makes all checks to decide wether redirect to riff-app(for login, waiting room etc) or proceed with conference.
 *
 * @returns {boolean}
*/
export async function shouldRedirectToRiff() {
    if (process.env.MATTERMOST_EMBEDDED_ONLY === 'true') {
        setMatterMostUserFromLink();

        return false;
    }

    if (await shouldRedirectToLoginPage() || await shouldRedirectToWaitingRoom()) {
        return true;
    }

    return false;
}

/**
 * Redirects from jitsi to Waiting room.
 *
 * @returns {boolean}
*/
export async function shouldRedirectToWaitingRoom() {
    // no redirect if we're on riff-platform app already. And no redirect for recorder.
    if (isRiffPlatformCurrentPath() || config.iAmRecorder) {
        return false;
    }

    const meetingId = window.location.pathname.split('/')[1];
    const res = await APP.store.dispatch(checkIsMeetingAllowed(meetingId));

    if (res.error) {
        customHistory.push(`${ROUTES.BASENAME}${ROUTES.WAITING}/${meetingId}`);

        return true;
    }

    return false;
}

/**
 * Redirects from jitsi to Login.
 *
 * @returns {boolean}
*/
export async function shouldRedirectToLoginPage() {
    if (config.iAmRecorder) {
        const user = {
            uid: 'Recorder',
            displayName: 'Recorder',
            email: 'Recorder@Recorder.Recorder'
        };

        APP.store.dispatch({
            type: actionTypes.LOGIN_SUCCESS,
            user
        });

        return false;
    }

    const user = await api.isAuth();

    if (user === null) {
        // if meetingId path and if allowed anon user
        if (!isRiffPlatformCurrentPath() && await isAnonymousUsersAllowed()) {
            return false;
        }

        return true;
    }

    APP.store.dispatch({
        type: actionTypes.LOGIN_SUCCESS,
        user
    });
    setLocalDisplayNameAndEmail(user);

    return false;
}

/**
 * Check if anonymous users allowed in current meeting.
 *
 * @returns {boolean}
*/
export async function isAnonymousUsersAllowed() {
    const userMock = {
        uid: ObjectID.generate(),
        displayName: '',
        email: '',
        isAnon: true
    };

    APP.store.dispatch({
        type: actionTypes.LOGIN_SUCCESS,
        user: userMock
    });
    setLocalDisplayNameAndEmail(userMock);

    const meetingId = window.location.pathname.split('/')[1];
    const res = await APP.store.dispatch(checkIsMeetingAllowed(meetingId));

    if (res.meeting?.allowAnonymous) {
        return true;
    }

    APP.store.dispatch(logout());
    previousLocationRoomName.set(window.location.pathname);

    return false;
}

/**
 * Sets user and meeting data from link for mattermost app.
 *
 * @returns {boolean}
*/
export async function setMatterMostUserFromLink() {
    const urlParams = new URLSearchParams(window.location.search);

    const userMock = {
        uid: urlParams.get('uid') || ObjectID.generate(),
        displayName: urlParams.get('name') || 'No name',
        email: '',
        context: urlParams.get('context') || ''
    };
    const meetingMock = {
        _id: ObjectID.generate(),
        roomId: window.location.pathname.split('/')[1],
        name: urlParams.get('title') || 'No meeting title'
    };

    APP.store.dispatch({
        type: actionTypes.LOGIN_SUCCESS,
        user: userMock
    });
    APP.store.dispatch({
        type: actionTypes.MEETING_SUCCESS,
        meeting: meetingMock
    });
    setLocalDisplayNameAndEmail(userMock);
}

/**
 * Sets dispayName(uid|name) and email to jitsi.
 *
 * @param {Object} user - User object {uid, displayName, email}.
 * @returns {Promise.resolve}
*/
export function setLocalDisplayNameAndEmail(user) {
    APP.conference.changeLocalDisplayName(`${user.uid}|${user.displayName}`);
    APP.conference.changeLocalEmail(user.email);
}


/**
 * Sets tile view in jitsi platform.
 *
 * @returns {void}
*/
export function setTileViewByDefault() {
    return (dispatch, getState) => {
        if (!getState()['features/video-layout'].tileViewEnabled) {
            dispatch(setTileView(true));
        }
    };
}

/**
 * Redirects to riff (dashboard, meeting_ended page, ...) after the meeting.
 *
 * @returns {void}
*/
export function redirectToRiffAfterMeeting() {
    return async (dispatch, getState) => {
        const roomId = getState()['features/riff-platform'].riff.roomId;
        const { uid, isAnon } = getState()['features/riff-platform'].signIn.user;

        if (roomId) {
            await participantLeaveRoom(roomId, uid);
        }

        // if in iframe, send message to parent window (for embedding in mattermost)
        window.parent.postMessage('JITSI_CONFERENCE_END', '*');

        if (isAnon) {
            dispatch(logout());

            return navigateWithoutReload(RiffPlatform, `${ROUTES.BASENAME}${ROUTES.MEETING_ENDED}`);
        }

        navigateWithoutReload(RiffPlatform, `${ROUTES.BASENAME}${ROUTES.DASHBOARD}`);
    };
}

/**
 * Sets tile view after youtube sharing.
 *
 * @returns {void}
*/
export function setTileViewAfterYoutubeSharing() {
    return dispatch => {
        APP.UI.addListener(
            UIEvents.UPDATE_SHARED_VIDEO,
            // eslint-disable-next-line max-params, no-unused-vars
            (url, state, time, isMuted, volume) => {
                if (state === 'removed') {
                    dispatch(setTileView(true));
                }
            });
    };
}

// Starts all riff services with conference.
// eslint-disable-next-line require-jsdoc
export function startRiffServices(tracks) {
    return dispatch => {
        dispatch(setTileViewByDefault());
        dispatch(attachSibilant(tracks));
        dispatch(setTileViewAfterYoutubeSharing());
    };
}
