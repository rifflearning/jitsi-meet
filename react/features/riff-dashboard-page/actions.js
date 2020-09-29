/* global APP, config */

import Sibilant from 'sibilant-webaudio';
import { firebaseApp } from 'libs/utils/firebase_utils';

import { getLocalJitsiAudioTrack } from '../base/tracks';
import { setTileView } from '../video-layout';

import * as actionTypes from './actionTypes';
import { app, socket } from 'libs/riffdata-client';
import { subscribeToEmotionsData } from '../riff-emotions/actions';

export function setRiffServerRoomId(roomId) {
    return {
        type: actionTypes.SET_RIFF_SERVER_ROOM_ID,
        payload: roomId
    };
}

export function redirectToRiffMetrics() {
    return async (dispatch, getState) => {
        const { roomId, userData: { uid } } = getState()['features/riff-metrics'];

        await participantLeaveRoom(roomId, uid);

        getState()['features/base/app'].app._navigate({
            href: '/static/dashboard.html'
        });
    };
}

export function setTileViewByDefault() {
    return (dispatch, getState) => {
        if (!getState()['features/video-layout'].tileViewEnabled) {
            dispatch(setTileView(true));
        }
    };
}

export function attachSibilant() {
    return async (dispatch, getState) => {
        const stream = getLocalJitsiAudioTrack(getState())?.stream;

        if (stream) {
            const speakingEvents = new Sibilant(stream);

            const { accessToken } = await loginToServerForSibilent();

            const userData = getState()['features/riff-metrics'].userData;
            const meetingUrl = getState()['features/recent-list'].pop()?.conference;
            const room = getState()['features/base/conference'].room;

            await riffAddUserToMeeting(userData, meetingUrl, room, accessToken);

            speakingEvents.bind('stoppedSpeaking', data => dispatch(sendUtteranceToServer(data, userData, room, accessToken)));

        } else {
            console.error('Error while attaching Sibilant. The track is not ready, will try again in 3 sec...');
            setTimeout(() => dispatch(attachSibilant()), 3000);
        }
    };
}

export async function riffAddUserToMeeting({ uid, displayName, email }, meetingUrl, room, token) {
    try {
        await socket.emit('meetingJoined', {
            participant: uid,
            email,
            name: displayName || uid,
            room,
            description: 'default meeting description',
            meetingUrl,
            consent: true,
            consentDate: new Date().toISOString(),
            token
        });
    } catch (error) {
        console.error('Error while riffAddUserToMeeting action');
    }
}

export function participantLeaveRoom(meetingId, participantId) {
    return app.service('meetings').patch(meetingId, {
        remove_participants: [ participantId ]
    })
        .then(res => {
            console.log(`Action.Riff: removed participant: ${participantId} from meeting ${meetingId}`, res);

            return true;
        })
        .catch(err => {
            console.error('Action.Riff: caught an error leaving the room:', err);

            return false;
        });
}

export async function loginToServerForSibilent() {
    try {

        const { accessToken, user: { _id: uid } } = await app.authenticate({
            strategy: 'local',
            email: 'default-user-email',
            password: 'default-user-password'
        });

        return { accessToken,
            uid
        };

    } catch (err) {
        console.error('Error while loginToServerForSibilent', err);
    }
}

function sendUtteranceToServer(data, {uid: participant}, room, token ) {
    return async (dispatch) => {
        try {
            const res = await app.service('utterances').create({
                participant,
                room,
                startTime: data.start.toISOString(),
                endTime: data.end.toISOString(),
                token
            });

            console.log({ createdUtter: res });

            dispatch(setRiffServerRoomId(res.meeting));

            return undefined;

        } catch (err) {
            console.error('Listener.WebRtc: ERROR', err);
        }
    }
}

export function maybeRedirectToLoginPage() {
    return new Promise(res => {
        if (!config.iAmRecorder) {
            firebaseApp.auth().onAuthStateChanged(user => {
                if (user === null) {
                    localStorage.setItem('prevPathname', window.location.pathname);
                    window.location.href = '/static/login.html';
                } else {
                    res();
                }
            });
        } else {
            res();
        }
    });
};

export function setRiffFirebaseCredentials(userData) {
    return (dispatch) => {
        APP.conference.changeLocalDisplayName(userData.uid + '|' + userData.displayName);
        APP.conference.changeLocalEmail(userData.email);

        dispatch({
            type: actionTypes.SET_RIFF_FIREBASE_CREDENTIALS,
            payload: userData
        });
    }
};

export function startRiffServices() {
    return dispatch => {
        dispatch(attachSibilant());
        dispatch(subscribeToEmotionsData());
    }
};
