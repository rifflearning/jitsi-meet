/* ******************************************************************************
 * riff.js                                                                      *
 * *************************************************************************/ /**
 *
 * @fileoverview Riffdata server redux actions
 *
 * Created on       August 15, 2018
 * @author          Dan Calacci
 *
 * @copyright (c) 2018-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import { app, socket } from 'libs/riffdata-client';
import { logger } from 'libs/utils';

import {
    RIFF_AUTHENTICATE_FAIL,
    RIFF_AUTHENTICATE_SUCCESS,
    RIFF_IS_MEETING_STARTED_UPDATE,
    RIFF_MEETING_ID_UPDATE,
    RIFF_PARTICIPANTS_CHANGED,
    RIFF_TURN_UPDATE,
} from 'Redux/constants/ActionTypes';


const riffAuthSuccess = (token) => {
    return { type: RIFF_AUTHENTICATE_SUCCESS,
             token: token };
};

const riffAuthFail = (err) => {
    return { type: RIFF_AUTHENTICATE_FAIL,
             error: err };
};

const updateTurnData = (transitions, turns) => {
    logger.debug('Action.Riff: updating turn data:', transitions, turns);
    return { type: RIFF_TURN_UPDATE,
             transitions: transitions,
             turns: turns };
};

const updateMeetingParticipants = (participants) => {
    logger.debug('Action.Riff: updating riff meeting participants', participants);
    return { type: RIFF_PARTICIPANTS_CHANGED,
             participants: participants };
};

const updateRiffMeetingId = (meetingId) => {
    return { type: RIFF_MEETING_ID_UPDATE,
             meetingId: meetingId };
};

const updateIsMeetingStarted = (isMeetingStarted) => {
    return {
        type: RIFF_IS_MEETING_STARTED_UPDATE,
        isMeetingStarted,
    };
};


// TODO - this doesn't return an action???
const participantLeaveRoom = (meetingId, participantId) => {
    return app.service('meetings').patch(meetingId, {
        remove_participants: [ participantId ]
    })
    .then((res) => {
        logger.debug(`Action.Riff: removed participant: ${participantId} from meeting ${meetingId}`, res);
        return true;
    })
    .catch(function (err) {
        logger.error('Action.Riff: shit, caught an error leaving the room:', err);
        return false;
    });
};

const attemptRiffAuthenticate = () => (dispatch) => {
    app.authenticate({
        strategy: 'local',
        email: window.client_config.dataServer.email,
        password: window.client_config.dataServer.password,
    })
    .then(function (result) {
        logger.debug('Action.Riff: data-server auth result!: ', result);
        dispatch(riffAuthSuccess(result.accessToken));
    }.bind(this))
    .catch(function (err) {
        logger.error('Action.Riff: data-server auth ERROR:', err);
        dispatch(riffAuthFail(err));
        logger.info('Action.Riff: trying to authenticate again...');
        dispatch(attemptRiffAuthenticate());
    });
};

const riffAddUserToMeeting = (uid, email, roomName, nickName, meetingType,
                              url, token) => {
    logger.debug('Action.Riff: [riff] adding users to meeting ');

    return socket.emit('meetingJoined', {
        participant: uid,
        email: email,
        name: nickName,
        room: roomName,
        description: meetingType,
        meetingUrl: url,
        consent: true,
        consentDate: new Date().toISOString(),
        token: token,
    });
};

const riffCreateParticipant = async (user) => {
    return app.service('participants').create({
        _id: user.uid,
        consent: true,
        consentDate: new Date(),
        email: user.email,
        isHost: true,
        name: user.displayName,
        roomTitle: user.roomName,
    });
};

const riffCreatePersonalRoom = async (user) => {
    return app.service('personalRooms').create({
        owner: user.uid,
        title: user.roomName,
    });
};

const riffChangeRoomName = async (uid, roomName) => {
    return app.service('personalRooms').patch(
        null,
        { title: roomName },
        { query: { owner: uid } }
    );
};

const riffGetRoomFromUser = async (uid) => {
    const rooms = await app.service('personalRooms').find({ query: { owner: uid } });
    // we expect there to be exactly one room associated with a user
    // if this is not true, the user does not have a personal room
    if (rooms.length !== 1) {
        return null;
    }

    return rooms[0];
};

const riffGetRoomFromId = async (roomId) => {
    try {
        const room = await app.service('personalRooms').get(roomId);
        return room;
    }
    catch (err) {
        // there was no matching record, return null to indicate
        return null;
    }

};

/** Is the owner of the room currently in it?
 * Takes a room object
 * returns boolean
 */
const riffGetIsHostInRoom = async (room) => {
    const mtgs = await app.service('meetings').find({
        query: {
            room: room._id,
            participants: room.owner,
        }
    });

    return mtgs.length === 1;
};

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    riffAuthSuccess,
    riffAuthFail,
    updateIsMeetingStarted,
    updateTurnData,
    updateMeetingParticipants,
    updateRiffMeetingId,
    participantLeaveRoom,
    attemptRiffAuthenticate,
    riffAddUserToMeeting,
    riffCreateParticipant,
    riffCreatePersonalRoom,
    riffChangeRoomName,
    riffGetRoomFromUser,
    riffGetRoomFromId,
    riffGetIsHostInRoom,
};
