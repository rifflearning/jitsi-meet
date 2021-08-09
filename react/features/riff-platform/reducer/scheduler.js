import * as actionTypes from '../constants/actionTypes';

const initialState = {
    loading: false,
    error: null,
    updateLoading: false,
    updateError: null
};

export default (state = initialState, action) => {
    switch (action.type) {
    case actionTypes.SCHEDULER_REQUEST:
        return { ...state,
            loading: true,
            error: null };
    case actionTypes.SCHEDULER_SUCCESS:
        return { ...state,
            loading: false,
            error: null,
            meeting: action.meeting };
    case actionTypes.SCHEDULER_FAILURE:
        return { ...state,
            loading: false,
            error: action.error };
    case actionTypes.SCHEDULER_RESET:
        return { ...state,
            loading: false,
            error: null,
            meeting: null };
    case actionTypes.UPDATE_SCHEDULER_REQUEST:
        return { ...state,
            updateLoading: true,
            updateError: null };
    case actionTypes.UPDATE_SCHEDULER_SUCCESS:
        return { ...state,
            updateLoading: false,
            updateError: null,
            updatedMeeting: action.meeting };
    case actionTypes.UPDATE_SCHEDULER_FAILURE:
        return { ...state,
            updateLoading: false,
            updateError: action.error };
    case actionTypes.UPDATE_SCHEDULER_RESET:
        return { ...state,
            updateLoading: false,
            updateError: null,
            updatedMeeting: null };

    default:
        return state;
    }
};
