/* eslint-disable require-jsdoc */
import api from '../api';
import * as actionTypes from '../constants/actionTypes';

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
            const res = api.fetchUserPersonalMeeting();

            if (res) {
                meeting = res;
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
