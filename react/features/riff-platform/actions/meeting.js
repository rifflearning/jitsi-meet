/* eslint-disable object-property-newline */
/* eslint-disable curly */
/* eslint-disable require-jsdoc */

import api from '../api';
import * as actionTypes from '../constants/actionTypes';
import * as errorTypes from '../constants/errorTypes';

function meetingRequest() {
    return {
        type: actionTypes.MEETING_REQUEST
    };
}

function meetingSuccess(meeting) {
    return {
        type: actionTypes.MEETING_SUCCESS,
        meeting
    };
}

function meetingFailure(error) {
    return {
        type: actionTypes.MEETING_FAILURE,
        error
    };
}

export function getMeeting(meetingId) {
    return async dispatch => {
        dispatch(meetingRequest());
        let meeting = null;

        try {
            // const res = await api.fetchMeeting(meetingId);
            const res = await api.fetchMeetingByRoomId(meetingId);

            if (res) {
                meeting = res;

                // store the current roomId with the selected room number (if present)
                dispatch(meetingSuccess({ ...meeting, roomId: meetingId }));
            } else {
                dispatch(meetingFailure('No meeting with this ID'));
            }
        } catch (error) {
            dispatch(meetingFailure('No meeting with this ID'));
            console.error('Error in getMeeting', error);
        }

        return meeting;
    };
}

export function getMeetingById(meetingId) {
    return async dispatch => {
        dispatch(meetingRequest());
        let meeting = null;

        try {
            const res = await api.fetchMeeting(meetingId);

            if (res) {
                meeting = res;
                dispatch(meetingSuccess(meeting));
            } else {
                dispatch(meetingFailure('No meeting with this ID'));
            }
        } catch (error) {
            dispatch(meetingFailure('No meeting with this ID'));
            console.error('Error in getMeeting', error);
        }

        return meeting;
    };
}

export function checkIsMeetingAllowed(meetingId) {
    return async (dispatch, getState) => {
        try {
            const { uid: myUid, isAnon } = getState()['features/riff-platform'].signIn.user;
            const meeting = await dispatch(getMeeting(meetingId));
            const meetingError = errorType => {
                return { meeting, error: errorType };
            };

            if (!meeting) return meetingError(errorTypes.NO_MEETING);

            // is time to meeting left less than 5 minutes
            if (timeToMeeting(meeting) > 5 * 60 * 1000) return meetingError(errorTypes.NOT_A_MEETING_TIME);

            const isHost = meeting.createdBy === myUid;

            // New user can join meeting only before dateEnd.
            // if not in list of participants and nowDate>dateEnd, then error
            const didIVisitMeeting = myUid === meeting.participantsVisited.find(el => el === myUid);
            const isMetengExpired = new Date() > new Date(meeting.dateEnd);

            if (meeting.forbidNewParticipantsAfterDateEnd && !isHost && !didIVisitMeeting && isMetengExpired) {
                return meetingError(errorTypes.NOT_JOIN_NEW_USER_TO_ENDED_MEETING);
            }

            if (!didIVisitMeeting && !isAnon) await sendAddParticipantToMeeting(meeting);

            // if waitForHost required, check if host entered
            // eslint-disable-next-line max-len
            if (!isHost && meeting.waitForHost && !isHostEntered(meeting)) return meetingError(errorTypes.NO_HOST_ERROR);

            // if host, send isHostJoined - timestamp;
            if (meeting.waitForHost && isHost) await sendIsHostJoinedTimeStamp(meeting); // or not await?

            return { meeting };
        } catch (error) {
            return { error };
        }
    };
}

// externalize check functions

function timeToMeeting(meeting) {
    return new Date(meeting.dateStart).getTime() - Date.now();
}

async function sendIsHostJoinedTimeStamp(meeting) {
    try {
        await api.updateMeeting(meeting._id, { hostJoinedAt: new Date() });
    } catch (error) {
        console.error('Error in checkIsMeetingAllowed, api.updateMeeting', error);
    }
}

async function sendAddParticipantToMeeting(meeting) {
    try {
        await api.joinMeeting(meeting._id);
    } catch (error) {
        console.error('Error in sendAddParticipantToMeeting', error);
    }
}

function isHostEntered(meeting) {
    if (meeting.hostJoinedAt) {

        // host joined not older than 2 hours
        const threeHours = 3 * 60 * 60 * 1000;
        const fiveMinutes = 5 * 60 * 1000;
        const hostJoinedAtDate = new Date(meeting.hostJoinedAt);
        const timeFromHostJoined = Date.now() - hostJoinedAtDate;
        const timeFromMeetingCouldStart = new Date(meeting.dateStart) - fiveMinutes;
        // eslint-disable-next-line max-len
        const isJoinedNotLongAgo = threeHours > timeFromHostJoined && hostJoinedAtDate > timeFromMeetingCouldStart;

        return isJoinedNotLongAgo;
    }

    return false;
}

export function meetingReset() {
    return {
        type: actionTypes.MEETING_RESET
    };
}
