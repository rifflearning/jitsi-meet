/* ******************************************************************************
 * actions.js                                                                   *
 * *************************************************************************/ /**
 *
 * @fileoverview riff-integration redux action creators
 *
 * Created on       January 3, 2022
 * @author          Jordan Reedie
 *
 * @copyright (c) 2022 Riff Analytics,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

/* global riffConfig */

import { riffdataClient } from '@rifflearning/riff-metrics';

import {
    RIFF_SET_ACCESS_TOKEN,
    RIFF_SET_MEETING_CONTEXT,
    RIFF_SET_MEETING_ID,
    RIFF_SET_MEETING_TITLE,
    RIFF_SET_PARTICIPANT_ID,
} from './actionTypes';
import { getRiffState } from './functions';
import { getRiffApp, setRiffApp } from './riffClient';

/**
 * Redux action to set Riff App access token for authorization
 *
 * @param {string} accessToken - The access token provided
 * by the server during authentication
 * @returns {ReduxAction}
 */
function setRiffAccessToken(accessToken) {
    return {
        type: RIFF_SET_ACCESS_TOKEN,
        accessToken,
    };
}

/**
 * Redux action to set Riff meeting context
 *
 * @param {string} meetingContext - The meeting context
 * @returns {Object}
 */
function setRiffMeetingContext(meetingContext) {
    return {
        type: RIFF_SET_MEETING_CONTEXT,
        meetingContext,
    };
}

/**
 * Redux action to set Riff meeting title
 *
 * @param {string} meetingTitle - The meeting title
 * @returns {Object}
 */
function setRiffMeetingTitle(meetingTitle) {
    return {
        type: RIFF_SET_MEETING_TITLE,
        meetingTitle,
    };
}

/**
 * Redux action to set Riff participant ID
 *
 * @param {string} participantId - The local user's Riff Id
 * @returns {Object}
 */
function setRiffParticipantId(participantId) {
    return {
        type: RIFF_SET_PARTICIPANT_ID,
        participantId,
    };
}

/**
 * Redux action to set Riff meeting ID
 *
 * @param {string | null} meetingId - The current Riff meeting ID,
 * or null if the user is not in a meeting.
 * @returns {ReduxAction}
 */
function setRiffMeetingId(meetingId) {
    return {
        type: RIFF_SET_MEETING_ID,
        meetingId,
    };
}

/**
 * Initiates the connection to the riff data server,
 * performs authentication & stores the access token
 * (once authentication succeeds) in redux.
 *
 * @returns {ReduxAsyncThunk}
 */
function connectToRiffDataServer() {
    return async dispatch => {
        const riffdataStatus = (status, data) => {
            if (status === 'success') {
                dispatch(setRiffAccessToken(data));
            }
        };

        try {
            const { app } = riffdataClient.startRiffdataApp({
                url: riffConfig.riffdata.url,
                path: riffConfig.riffdata.path,
                email: riffConfig.riffdata.email,
                password: riffConfig.riffdata.password,
                notifyStatus: riffdataStatus,
            });

            setRiffApp(app);
        } catch (err) {
            console.error('Error while attempting to login to Riff Data Server', err);
        }
    };
}

/**
 * Adds the user to the riff meeting on the server and updates
 * the redux state.
 *
 * Due to the way the meeting join process works, we have to add
 * a listener to the meeting service to be able to capture the
 * meeting ID. This is not ideal but until we update the server
 * it must be done this way
 * - jr 1.5.22
 *
 * @returns {ReduxAsyncThunk}
 */
function riffAddUserToMeeting() {
    return async (dispatch, getState) => {
        const {
            accessToken: token,
            displayName,
            participant,
            room,
            meetingTitle: title,
            meetingContext: context,
        } = getRiffState(getState());

        const app = getRiffApp();
        const meetingListener = meeting => {
            if (meeting.room === room && meeting.participants.includes(participant)) {
                app.service('meetings').removeListener('patched', meetingListener);
                dispatch(setRiffMeetingId(meeting._id));
            }
        };

        try {
            // we need to listen for a patch or created event to update the meeting ID
            // this occurs after the user joins the meeting. this is kinda clunky but
            // it would require changes on the server side to implement differently
            app.service('meetings').on('patched', meetingListener);

            app.io.emit('meetingJoined', {
                participant,
                name: displayName,
                room,
                title,
                context,
                token,
            });
        } catch (error) {
            // TODO - jr - retry?
            console.error('Error while riffAddUserToMeeting action', error);
        }
    };
}

/**
 * Removes the user from a riff meeting and updates redux state
 * An onunload listener is hooked up when a conference starts
 * and unhooked when it ends by the riff-integration middleware to
 * invoke this action if the window/tab is closed during a meeting.
 *
 * @returns {ReduxAsyncThunk}
 */
function riffRemoveUserFromMeeting() {
    return async (dispatch, getState) => {
        const { meetingId, participant: participantId } = getRiffState(getState());
        const app = getRiffApp();

        try {
            await app.service('meetings').patch(
                meetingId,
                // eslint-disable-next-line camelcase
                { remove_participants: [ participantId ] },
            );
            dispatch(setRiffMeetingId(null));
        } catch (error) {
            console.error('Error removing user from meeting!', error);
        }
    };
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    connectToRiffDataServer,
    riffAddUserToMeeting,
    riffRemoveUserFromMeeting,
    setRiffAccessToken,
    setRiffMeetingContext,
    setRiffMeetingId,
    setRiffMeetingTitle,
    setRiffParticipantId,
};
