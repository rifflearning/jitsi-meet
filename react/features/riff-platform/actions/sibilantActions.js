/* global config, APP, riffConfig */
/* eslint-disable require-jsdoc */

import Sibilant from '@rifflearning/sibilant';

import UIEvents from '../../../../service/UI/UIEvents';
import * as actionTypes from '../constants/actionTypes';
import { app, socket } from '../libs/riffdata-client';

function joinRiffMeeting(meeting) {
    return {
        type: actionTypes.JOIN_RIFF_MEETNG,
        meeting
    };
}

function leaveRiffMeeting() {
    return {
        type: actionTypes.LEAVE_RIFF_MEETNG
    };
}

export function attachSibilant(tracks) {
    return async (dispatch, getState) => {
        try {
            const { accessToken } = await loginToRiffDataServer();

            const userData = getState()['features/riff-platform'].signIn.user;
            const room = window.location.pathname.split('/')[1];
            const title = getState()['features/riff-platform'].meeting?.meeting?.name;
            const agenda = getState()['features/riff-platform'].meeting?.meeting?.agenda;

            dispatch(riffAddUserToMeeting(userData, room, accessToken, title, agenda));

            if (config.iAmRecorder) {
                const mockData = {
                    start: new Date(),
                    end: new Date()
                };

                sendUtteranceToRiffDataServer(mockData, userData, room, accessToken);

                return;
            }

            let oldStream = null;

            const stream = tracks.find(t => t.isAudioTrack())?.stream || null;

            // attach initialStream
            if (stream) {
                bindSibilantToStream(stream);
            }

            // add more notes
            // try attach sibilant on devicelist change
            document.addEventListener('RIFF_UPDATE_DEVICE_LIST', () => bindSibilantToStream());

            // try attach sibilant on change audio device // setTimeout as a temprorary solution
            APP.UI.addListener(UIEvents.AUDIO_DEVICE_CHANGED, () => setTimeout(() => bindSibilantToStream(), 1000));

            // eslint-disable-next-line no-inner-declarations
            function bindSibilantToStream(initialStream) {
                // eslint-disable-next-line max-len
                const newStream = initialStream || APP.store.getState()['features/base/conference'].conference?.getLocalAudioTrack()?.stream;

                if (newStream && newStream !== oldStream) {
                    oldStream = newStream;
                    const speakingEvents = new Sibilant(newStream);

                    speakingEvents.bind(
                            'stoppedSpeaking',
                            data => sendUtteranceToRiffDataServer(data, userData, room, accessToken)
                    );
                }
            }
        } catch (error) {
            console.error('Error while attachSibilant', error);
        }
    };
}

function riffAddUserToMeeting({ uid, displayName, context = '' }, room, token, title, agenda) {
    return async dispatch => {
        try {
            const meetingListener = meeting => {
                if (meeting.active && meeting.room === room && meeting.participants.includes(uid)) {
                    app.service('meetings').removeListener('patched', meetingListener);
                    dispatch(joinRiffMeeting(meeting));
                }
            };

            app.service('meetings').on('patched', meetingListener);

            socket.emit('meetingJoined', {
                participant: uid,
                name: displayName,
                room,
                title,
                context,
                token,
                agenda
            });

        } catch (error) {
            console.error('Error while riffAddUserToMeeting action', error);
        }
    };
}

export function participantLeaveRoom(meetingId, participantId) {
    return async dispatch => {
        try {
            await app.service('meetings').patch(meetingId, {
            // eslint-disable-next-line camelcase
                remove_participants: [ participantId ]

            });

            dispatch(leaveRiffMeeting());

        } catch (error) {
            console.error('Action.Riff: caught an error leaving the room:', error);

            return error;
        }
    };
}

async function loginToRiffDataServer() {
    try {
        const { accessToken, user: { _id: uid } } = await app.authenticate({
            strategy: 'local',
            email: riffConfig.riffdata.email,
            password: riffConfig.riffdata.password
        });

        return {
            accessToken,
            uid
        };
    } catch (err) {
        console.error('Error while loginToRiffDataServer', err);
    }
}

async function sendUtteranceToRiffDataServer(data, { uid: participant }, room, token) {
    try {
        const volumesObj = riffConfig.metrics.sendUtteranceVolumes
            ? { volumes: data.volumes }
            : {};
        const res = await app.service('utterances').create({
            participant,
            room,
            startTime: data.start.toISOString(),
            endTime: data.end.toISOString(),
            token,
            ...volumesObj
        });

        console.log({ sentUtteranceToRiffData: res });

        // const roomIdFromRiffDataServer = res.meeting;

        // dispatch(joinRiffMeeting(roomIdFromRiffDataServer));

        return undefined;
    } catch (err) {
        console.error('Error while sendUtteranceToRiffDataServer', err);
    }
}
