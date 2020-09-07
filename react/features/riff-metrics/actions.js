/* eslint-disable require-jsdoc */
/* eslint-disable no-empty-function */
/* global APP */

import Sibilant from 'sibilant-webaudio';

import { getLocalJitsiAudioTrack } from '../base/tracks';
import { setTileView } from '../video-layout';

import * as actionTypes from './actionTypes';
// import DashboardPage from './components/DashboardPage';
import { app, socket } from './libraries/riffdata-client';
import {
    cmpObjectProp,
    getDurationInSeconds,
    groupByPropertyValue
} from './libraries/utils';

export function setRiffServerRoomId(roomId) {
    return {
        type: actionTypes.SET_RIFF_SERVER_ROOM_ID,
        payload: roomId
    };
}


export function setSelectedMeeting(meetingObj) {
    return {
        type: actionTypes.SET_SELECTED_MEETING,
        payload: meetingObj
    };

}

export function setJitsiUidForRiffServer(uid) {
    return {
        type: actionTypes.SET_JITSI_UID_FOR_RIFF_SERVER,
        payload: uid
    };
}

export function setJitsiUserNameForRiffServer(userName) {
    return {
        type: actionTypes.SET_JITSI_USERNAME_FOR_RIFF_SERVER,
        payload: userName
    };
}

export function redirectToRiffMetrics() {
    return async (dispatch, getState) => {
        await participantLeaveRoom();

        getState()['features/base/app'].app._navigate({
            // component: DashboardPage,
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

            await riffAddUserToMeeting(accessToken);

            speakingEvents.bind('stoppedSpeaking', data => sendUtteranceToServer(data, accessToken));

        } else {
            console.error('Error while attaching Sibilant. The track is not ready, will try again in 3 sec...');
            setTimeout(() => dispatch(attachSibilant()), 3000);
        }
    };
}

export async function riffAddUserToMeeting(token) {
    try {

        const state = APP.store.getState();
        const { id: uid, name = uid, email } = state['features/base/participants'][0];

        APP.store.dispatch(setJitsiUidForRiffServer(uid));
        APP.store.dispatch(setJitsiUserNameForRiffServer(name));

        // APP.store.dispatch(setJitsiEmailForRiffServer(email));

        const meetingUrl = state['features/recent-list'][state['features/recent-list'].length - 1].conference;
        const room = window.location.pathname.slice(1);

        const { id: roomId } = await socket.emit('meetingJoined', {
            participant: uid,
            email,
            name,
            room,
            description: 'default meeting description',
            meetingUrl,
            consent: true,
            consentDate: new Date().toISOString(),
            token
        });

        return roomId;
    } catch (error) {
        console.error('Error while riffAddUserToMeeting action');
    }
}

export function participantLeaveRoom(participantId = APP.store.getState()['features/base/participants'][0].id) {
    const { roomId } = APP.store.getState()['features/riff-metrics'];

    return app.service('meetings').patch(roomId, {
        // eslint-disable-next-line camelcase
        remove_participants: [ participantId ]
    })
        .then(res => {
            console.log(`Action.Riff: removed participant: ${participantId} from meeting ${roomId}`, res);

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

export async function getMeetingId(uid) {

    const participants = await app.service('participants').get(uid);

    console.log({ participants });

    const allParticipantsMeetings = await app.service('meetings')
            .find({
                query: {
                    _id: participants.meetings[participants.meetings.length - 1]
                }
            });

    APP.store.dispatch(setSelectedMeeting(allParticipantsMeetings[0]));
    console.log({ allParticipantsMeetings });

    return { meetingId: allParticipantsMeetings[0]._id,
        selectedMeeting: allParticipantsMeetings[0] };
}

export function getMeetingData() {
    return async dispatch => {
        try {
            await loginToServerForSibilent();
            const uid = APP.store.getState()['features/riff-metrics'].uid;

            const { selectedMeeting } = await getMeetingId(uid);

            await dispatch(loadMeetingData(uid, selectedMeeting._id));

        } catch (error) {
            console.error('Error while getting meeting data', error);
        }
    };
}

async function sendUtteranceToServer(data, token) {
    try {
        const participant = APP.store.getState()['features/base/participants'][0].id;
        const room = window.location.pathname.slice(1);

        const res = await app.service('utterances').create({
            participant,
            room,
            startTime: data.start.toISOString(),
            endTime: data.end.toISOString(),
            token
        });

        console.log({ createdUtter: res });

        APP.store.dispatch(setRiffServerRoomId(res.meeting));

        return undefined;

    } catch (err) {
        console.error('Listener.WebRtc: ERROR', err);
    }
}

function loadMeetingData(uid, meetingId) {
    async function thunk(dispatch /* , getState*/) {
        const rawUtterances = await app.service('utterances')
            .find({
                query: {
                    meeting: meetingId,
                    $limit: 10000,
                    stitch: true
                }
            });

        const sortedUtterances = rawUtterances.slice().sort(cmpObjectProp('startTime'));
        const participantUtterances = groupByPropertyValue(sortedUtterances, 'participant');

        console.log('Action.dashboard.loadMeetingData: utterances:',
                     { raw: rawUtterances,
                         sorted: sortedUtterances,
                         grouped: participantUtterances });

        const speakingParticipantIds = Object.keys(participantUtterances);
        const participantsQResponse = await app.service('participants')
            .find({ query: { _id: { $in: speakingParticipantIds },
                $limit: 100
            }
            });

        if (participantsQResponse.total > participantsQResponse.limit) {
            console.error('Action.dashboard.loadMeetingData: Error: Too many participants '
                         + `(${participantsQResponse.total}) for query. `
                         + `Raise limit of ${participantsQResponse.limit}`);
        }
        const speakingParticipants = participantsQResponse.data
            .reduce((partMap, p) => partMap.set(p._id, { id: p._id,
                name: p.name,
                email: p.email }), new Map());

        console.log('Action.dashboard.loadMeetingData: speakingParticipants:',
                     { participantsQResponse,
                         speakingParticipants });

        return Promise.all([
            getMeetingStats(participantUtterances, speakingParticipants, meetingId, dispatch)
        ]);
    }

    return thunk;
}

async function getMeetingStats(participantUtterances, speakingParticipants, meetingId, dispatch) {
    try {
        const participantStats = [];

        for (const participant of speakingParticipants.values()) {
            const utterances = participantUtterances[participant.id];
            const numUtterances = utterances.length;
            const totalSecsUtterances
                = utterances.reduce((uSecs, u) => uSecs + getDurationInSeconds(u.startTime, u.endTime), 0);
            const meanSecsUtterances = numUtterances ? totalSecsUtterances / numUtterances : 0;

            participantStats.push({
                name: participant.name,
                participantId: participant.id,
                numUtterances,
                lengthUtterances: totalSecsUtterances,
                meanLengthUtterances: meanSecsUtterances
            });
        }

        console.log('Action.dashboard.getMeetingStats: success', { participantStats });

        // We've successfully loaded the meeting stats
        dispatch({
            type: actionTypes.DASHBOARD_FETCH_MEETING_STATS,
            status: 'loaded',
            meetingStats: participantStats
        });

        return participantStats;
    } catch (e) {
        console.error('Action.dashboard.getMeetingStats: ERROR encountered', e);

        // dispatch({
        //     type: ActionTypes.DASHBOARD_FETCH_MEETING_STATS,
        //     status: 'error',
        //     error: e
        // });

        throw e;
    }
}
