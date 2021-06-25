/* global config, APP, process */
/* eslint-disable require-jsdoc */

import Sibilant from '@rifflearning/sibilant';

import UIEvents from '../../../../service/UI/UIEvents';
import * as actionTypes from '../constants/actionTypes';
import { app, socket } from '../libs/riffdata-client';

function setRoomIdFromRiffDataServer(roomId) {
    return {
        type: actionTypes.SET_RIFF_SERVER_ROOM_ID,
        roomId
    };
}

export function attachSibilant(tracks) {
    return async (dispatch, getState) => {
        try {
            const { accessToken } = await loginToRiffDataServer();

            const userData = getState()['features/riff-platform'].signIn.user;
            const room = window.location.pathname.split('/')[1];
            const title = getState()['features/riff-platform'].meeting?.meeting?.name;

            await riffAddUserToMeeting(userData, room, accessToken, title);

            if (config.iAmRecorder) {
                const mockData = {
                    start: new Date(),
                    end: new Date()
                };

                dispatch(sendUtteranceToRiffDataServer(mockData, userData, room, accessToken));

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
                            data => dispatch(sendUtteranceToRiffDataServer(data, userData, room, accessToken))
                    );
                }
            }
        } catch (error) {
            console.error('Error while attachSibilant', error);
        }
    };
}

async function riffAddUserToMeeting({ uid, displayName, context = '' }, room, token, title) {
    try {
        socket.emit('meetingJoined', {
            participant: uid,
            name: displayName,
            room,
            title,
            context,
            token
        });
    } catch (error) {
        console.error('Error while riffAddUserToMeeting action', error);
    }
}

export function participantLeaveRoom(meetingId, participantId) {
    return app.service('meetings').patch(meetingId, {
        // eslint-disable-next-line camelcase
        remove_participants: [ participantId ]
    })
        .then(() => true)
        .catch(err => {
            console.error('Action.Riff: caught an error leaving the room:', err);

            return false;
        });
}

async function loginToRiffDataServer() {
    try {
        const { accessToken, user: { _id: uid } } = await app.authenticate({
            strategy: 'local',
            email: 'default-user-email',
            password: 'default-user-password'
        });

        return {
            accessToken,
            uid
        };
    } catch (err) {
        console.error('Error while loginToRiffDataServer', err);
    }
}

function sendUtteranceToRiffDataServer(data, { uid: participant }, room, token) {
    return async dispatch => {
        try {
            const volumesObj = process.env.SEND_SIBILANT_VOLUMES_TO_RIFF_DATA_SERVER === 'true'
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

            const roomIdFromRiffDataServer = res.meeting;

            dispatch(setRoomIdFromRiffDataServer(roomIdFromRiffDataServer));

            return undefined;
        } catch (err) {
            console.error('Error while sendUtteranceToRiffDataServer', err);
        }
    };
}
