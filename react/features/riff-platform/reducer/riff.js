import * as actionTypes from '../constants/actionTypes';

const initialState = {
    activeMeeting: null
};

export default (state = initialState, action) => {
    switch (action.type) {
    case actionTypes.JOIN_RIFF_MEETNG:
        return {
            ...state,
            activeMeeting: {
                startTime: new Date(action.meeting.startTime),
                meetingId: action.meeting._id
            } };

    case actionTypes.LEAVE_RIFF_MEETNG:
        return {
            ...state,
            activeMeeting: null
        };

    default:
        return state;
    }
};
