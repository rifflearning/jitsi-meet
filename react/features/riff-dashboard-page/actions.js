/* global APP, config */

import Sibilant from 'sibilant-webaudio';
import { firebaseApp } from 'libs/utils/firebase_utils';

import { setTileView } from '../video-layout';

import * as actionTypes from './actionTypes';
import { app, socket } from 'libs/riffdata-client';
import { subscribeToEmotionsData } from '../riff-emotions/actions';
import { sendStatsOnConnect } from './nodejs-browser-stats';

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

export function attachSibilant(tracks) {
    return async (dispatch, getState) => {
        try {
            const stream = tracks.find(t => t.isAudioTrack())?.stream;
            if (!stream) return console.error('No audio stream. Error while attaching sibilant in attachSibilant action.');

            const speakingEvents = new Sibilant(stream);

            const { accessToken } = await loginToServerForSibilent();

            const userData = getState()['features/riff-metrics'].userData;
            const meetingUrl = getState()['features/recent-list'].pop()?.conference;
            const room = getState()['features/base/conference'].room;

            await riffAddUserToMeeting(userData, meetingUrl, room, accessToken);

            speakingEvents.bind('stoppedSpeaking', data => dispatch(sendUtteranceToServer(data, userData, room, accessToken)));      
        } catch (error) {
            console.error('Error while attachSibilant', error);
        }
    };
}

export async function riffAddUserToMeeting({ uid, displayName, email }, meetingUrl, room, token) {
    try {
        await socket.emit('meetingJoined', {
            participant: uid,
            email,
            name: displayName,
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
            // console.log(`Action.Riff: removed participant: ${participantId} from meeting ${meetingId}`, res);

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
            // if (!localStorage.getItem('jwt-token') && (window.location.pathname !== '/app/login')) {
            if (window.location.pathname !== '/app/login') {
                localStorage.setItem('prevPathname', window.location.pathname);
                window.location.pathname = '/app/login'
            }
            firebaseApp.auth().onAuthStateChanged(user => {
                if (user === null) {
                    localStorage.setItem('prevPathname', window.location.pathname);
                    window.location.href = '/static/login.html';
                } else {
                    const { uid, email, displayName } = user;

                    APP.store.dispatch(setRiffFirebaseCredentials({
                        displayName: displayName || (email? email.split('@')[0] : 'Anonymous'),
                        email: email || 'anonymous',
                        uid
                    }));

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
        APP.conference.changeLocalDisplayName(`${userData.uid}|${userData.displayName}`);
        APP.conference.changeLocalEmail(userData.email);

        dispatch({
            type: actionTypes.SET_RIFF_FIREBASE_CREDENTIALS,
            payload: userData
        });
    }
};

export function startRiffServices(tracks) {
    return dispatch => {
        dispatch(setTileViewByDefault());

        maybeRedirectToLoginPage().then(() => {
            dispatch(attachSibilant(tracks));
            dispatch(subscribeToEmotionsData());

            sendStatsOnConnect();
        })
    }
};
