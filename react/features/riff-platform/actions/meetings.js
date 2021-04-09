/* eslint-disable require-jsdoc */

import api from '../api';
import * as actionTypes from '../constants/actionTypes';

function meetingsRequest() {
    return {
        type: actionTypes.MEETINGS_REQUEST
    };
}

function meetingsSuccess(meetingsLists) {
    return {
        type: actionTypes.MEETINGS_SUCCESS,
        meetingsLists
    };
}

function meetingsFailure(error) {
    return {
        type: actionTypes.MEETINGS_FAILURE,
        error
    };
}

export function getMeetings(listType) {
    return async dispatch => {
        dispatch(meetingsRequest());

        try {
            const res = await api.fetchMeetings(listType);

            dispatch(meetingsSuccess(res));
        } catch (e) {
            console.error('Error in getMeetings', e);
            dispatch(meetingsFailure(e.message));
        }
    };
}

export function getMeetingsByGroup(listType) {
    return async dispatch => {
        dispatch(meetingsRequest());

        try {
            const res = await api.fetchMeetingsByGroup(listType);

            dispatch(meetingsSuccess(res));
        } catch (e) {
            console.error('Error in getMeetingsByGroup', e);
            dispatch(meetingsFailure(e.message));
        }
    };
}

function deleteMeetingsRequest() {
    return {
        type: actionTypes.DELETE_MEETINGS_REQUEST
    };
}

function deleteMeetingsSuccess() {
    return {
        type: actionTypes.DELETE_MEETINGS_SUCCESS
    };
}

function deleteMeetingsFailure(error) {
    return {
        type: actionTypes.DELETE_MEETINGS_FAILURE,
        error
    };
}

export function deleteMeeting(id) {
    return async (dispatch, getState) => {
        dispatch(deleteMeetingsRequest());

        const state = getState();
        const meetingsListType = state['features/riff-platform'].meetings.listType;

        try {
            await api.deleteMeeting(id);
            dispatch(deleteMeetingsSuccess());
            dispatch(getMeetings(meetingsListType));
        } catch (e) {
            console.error('Error in deleteMeeting', e);
            dispatch(deleteMeetingsFailure(e.message));
        }
    };
}

export function deleteMeetingsRecurring(roomId) {
    return async (dispatch, getState) => {
        dispatch(deleteMeetingsRequest());

        const state = getState();
        const meetingsListType = state['features/riff-platform'].meetings.listType;

        try {
            await api.deleteMeetingsRecurring(roomId);
            dispatch(deleteMeetingsSuccess());
            dispatch(getMeetings(meetingsListType));
        } catch (e) {
            console.error('Error in deleteMeetingsRecurring', e);
            dispatch(deleteMeetingsFailure(e.message));
        }
    };
}

export function setMeetingsListType(listType) {
    return {
        type: actionTypes.SET_MEETINGS_LIST_TYPE,
        listType
    };
}
