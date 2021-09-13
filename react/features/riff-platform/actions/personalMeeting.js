/* eslint-disable require-jsdoc */
import api from '../api';
import * as actionTypes from '../constants/actionTypes';
import * as LIST_TYPES from '../constants/meetingsListTypes';
import * as ROUTES from '../constants/routes' 

function personalMeetingRequest() {
    return {
        type: actionTypes.PERSONAL_MEETING_REQUEST
    };
}

function personalMeetingSuccess(meeting) {
    return {
        type: actionTypes.PERSONAL_MEETING_SUCCESS,
        meeting
    };
}

function personalMeetingFailure(error) {
    return {
        type: actionTypes.PERSONAL_MEETING_FAILURE,
        error
    };
}

export function getUserPersonalMeetingRoom() {
    return async dispatch => {
        dispatch(personalMeetingRequest());
        let meeting = null;

        try {
            const res = await api.fetchMeetings(LIST_TYPES.PERSONAL);

            if (res.length) {
                meeting = res[0];
                dispatch(personalMeetingSuccess(meeting));
            } else {
                dispatch(personalMeetingFailure('No personal meeting'));
            }
        } catch (error) {
            dispatch(personalMeetingFailure('No personal meeting'));
            console.error('Error in getUserPersonalMeetingRoom', error);
        }

        return meeting;
    };
}

function createPersonalMeetingRequest() {
    return {
        type: actionTypes.PERSONAL_MEETING_REQUEST
    };
}

function createPersonalMeetingSuccess(meeting) {
    return {
        type: actionTypes.PERSONAL_MEETING_SUCCESS,
        meeting
    };
}

function createPersonalMeetingFailure(error) {
    return {
        type: actionTypes.PERSONAL_MEETING_FAILURE,
        error
    };
}

export function createPersonalMeetingRoom(meeting, callback) {
    return async dispatch => {
        dispatch(createPersonalMeetingRequest());

        try {
            const res = await api.scheduleMeeting(meeting);

            dispatch(createPersonalMeetingSuccess(res));
            if (callback) {

                callback();
            }
        } catch (e) {
            dispatch(createPersonalMeetingFailure(e.message));
        }
    };
}

function updatePersonalMeetingRequest() {
    return {
        type: actionTypes.PERSONAL_MEETING_REQUEST
    };
}

function updatePersonalMeetingSuccess(meeting) {
    return {
        type: actionTypes.PERSONAL_MEETING_SUCCESS,
        meeting
    };
}

function updatePersonalMeetingFailure(error) {
    return {
        type: actionTypes.PERSONAL_MEETING_FAILURE,
        error
    };
}

export function updatePersonalMeetingRoom(id, meeting, callback) {
    return async dispatch => {
        dispatch(updatePersonalMeetingRequest());

        try {
            const res = await api.updateMeeting(id, meeting);

            dispatch(updatePersonalMeetingSuccess(res));
            if (callback) {

                callback();
            }
        } catch (e) {
            dispatch(updatePersonalMeetingFailure(e.message));
        }
    };
}
