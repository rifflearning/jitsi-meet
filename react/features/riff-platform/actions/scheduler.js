/* eslint-disable require-jsdoc */
import api from '../api';
import * as actionTypes from '../constants/actionTypes';
import * as ROUTES from '../constants/routes';
import { checkMeetingSingleOccurrenceDate } from '../functions';

function schedulerRequest() {
    return {
        type: actionTypes.SCHEDULER_REQUEST
    };
}

function schedulerSuccess(meeting) {
    return {
        type: actionTypes.SCHEDULER_SUCCESS,
        meeting
    };
}

function schedulerFailure(error) {
    return {
        type: actionTypes.SCHEDULER_FAILURE,
        error
    };
}

export function schedule(meeting, history) {
    return async dispatch => {
        dispatch(schedulerRequest());

        try {
            const res = await api.scheduleMeeting(meeting);

            dispatch(schedulerSuccess(res));
            if (history) {
                // if the meeting has multiple rooms set default room number 1
                const meetingId = res.multipleRoomsQuantity ? `${res._id}-1` : res._id;

                history.push(`${ROUTES.MEETINGS}/${meetingId}`);
            }
        } catch (e) {
            dispatch(schedulerFailure(e.message));
        }
    };
}

function updateSchedulerRequest() {
    return {
        type: actionTypes.UPDATE_SCHEDULER_REQUEST
    };
}

function updateSchedulerSuccess(meeting) {
    return {
        type: actionTypes.UPDATE_SCHEDULER_SUCCESS,
        meeting
    };
}

function updateSchedulerFailure(error) {
    return {
        type: actionTypes.UPDATE_SCHEDULER_FAILURE,
        error
    };
}


export function updateSchedule(id, meeting, history) {
    return async dispatch => {
        dispatch(updateSchedulerRequest());

        try {
            await api.deleteMeeting(id);
            const res = await api.scheduleMeeting(meeting);

            dispatch(updateSchedulerSuccess(res));
            if (history) {
                // if the meeting has multiple rooms set default room number 1
                const meetingId = res.multipleRoomsQuantity ? `${res._id}-1` : res._id;

                history.push(`${ROUTES.MEETINGS}/${meetingId}`);
            }
        } catch (e) {
            dispatch(updateSchedulerFailure(e.message));
        }
    };
}

export function updateScheduleRecurring(roomId, meeting, history) {
    return async dispatch => {
        dispatch(updateSchedulerRequest());

        try {
            await api.deleteMeetingsRecurring(roomId);
            const res = await api.scheduleMeeting(meeting);

            dispatch(updateSchedulerSuccess(res));
            if (history) {
                // if the meeting has multiple rooms set default room number 1
                const meetingId = res.multipleRoomsQuantity ? `${res._id}-1` : res._id;

                history.push(`${ROUTES.MEETINGS}/${meetingId}`);
            }
        } catch (e) {
            dispatch(updateSchedulerFailure(e.message));
        }
    };
}

export function updateScheduleRecurringSingleOccurrence(id, roomId, meeting, history) {
    return async dispatch => {
        dispatch(updateSchedulerRequest());

        try {
            const meetings = await api.fetchMeetingsRecurring(roomId);
            const isMeetingDateValid = checkMeetingSingleOccurrenceDate({ meetingId: id,
                meeting,
                meetingsRecurring: meetings });

            if (isMeetingDateValid) {

                const res = await api.updateMeeting(id, meeting);

                dispatch(updateSchedulerSuccess(res));
                if (history) {
                    // if the meeting has multiple rooms set default room number 1
                    const meetingId = res.multipleRoomsQuantity ? `${res._id}-1` : res._id;

                    history.push(`${ROUTES.MEETINGS}/${meetingId}`);
                }
            } else {
                dispatch(updateSchedulerFailure('This occurrence has conflicts with an existing occurrence.'));
            }
        } catch (e) {
            dispatch(updateSchedulerFailure(e.message));
        }
    };
}

export function schedulerReset() {
    return {
        type: actionTypes.SCHEDULER_RESET
    };
}

export function updateSchedulerReset() {
    return {
        type: actionTypes.UPDATE_SCHEDULER_RESET
    };
}
