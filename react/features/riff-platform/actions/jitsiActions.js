/* global config, APP */
import { createBrowserHistory } from 'history';

import UIEvents from '../../../../service/UI/UIEvents';
import { setTileView } from '../../video-layout';
import { attachSibilant, participantLeaveRoom } from '../actions/sibilantActions';
import api from '../api';
import RiffPlatform from '../components';
import * as actionTypes from '../constants/actionTypes';
import * as ROUTES from '../constants/routes';
import { isRiffPlatformCurrentPath, previousLocationRoomName } from '../functions';

import { checkIsMeetingAllowed, getMeeting } from './meeting';

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
 * Redirects from jitsi to Waiting room.
 *
 * @returns {Promise.resolve}
*/
export async function maybeRedirectToWaitingRoom() {
    return new Promise(res => {

        const meetingId = window.location.pathname.split('/')[1];

        // no redirect if we're on riff-platform app already. And no redirect for recorder.
        if (isRiffPlatformCurrentPath() || config.iAmRecorder) {
            // get meeting for displaying name for recorder
            APP.store.dispatch(getMeeting(meetingId));

            return res();
        }

        APP.store.dispatch(checkIsMeetingAllowed(meetingId)).then(m => {
            if (m.error) {
                navigateWithoutReload(RiffPlatform, `${ROUTES.BASENAME}${ROUTES.WAITING}/${meetingId}`);
            } else {
                res();
            }
        });
    });
}


/**
 * Redirects from jitsi to Login.
 *
 * @returns {Promise.resolve}
*/
export function maybeRedirectToLoginPage() {
    return new Promise(res => {
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

            // setLocalDisplayNameAndEmail(user);

            return res();
        }
        api.isAuth().then(user => {
            if (user === null) {
                previousLocationRoomName.set(window.location.pathname);
                navigateWithoutReload(RiffPlatform);
            } else {
                APP.store.dispatch({
                    type: actionTypes.LOGIN_SUCCESS,
                    user
                });
                setLocalDisplayNameAndEmail(user);

                res();
            }
        });
    });
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
 * Redirect to riff-metric-page after the meeting.
 *
 * @returns {void}
*/
export function redirectToRiffMetrics() {
    return async (dispatch, getState) => {
        const roomId = getState()['features/riff-platform'].riff.roomId;
        const { uid } = getState()['features/riff-platform'].signIn.user;

        await participantLeaveRoom(roomId, uid);

        navigateWithoutReload(RiffPlatform, '/app/dashboard');
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
