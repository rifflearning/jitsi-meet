import * as actionTypes from '../constants/actionTypes';

const initialState = {
    loading: false,
    error: null,
    meeting: {},
    createError: null,
    createLoading: false,
    updateError: null,
    updateLoading: false
};

export default (state = initialState, action) => {
    switch (action.type) {
    case actionTypes.PERSONAL_MEETING_REQUEST:
        return {
            ...state,
            loading: true
        };
    case actionTypes.PERSONAL_MEETING_SUCCESS:
        return {
            ...state,
            loading: false,
            meeting: action.meeting
        };
    case actionTypes.PERSONAL_MEETING_FAILURE:
        return {
            ...state,
            loading: false,
            error: action.error
        };
    case actionTypes.UPDATE_PERSONAL_MEETING_REQUEST:
        return {
            ...state,
            updateLoading: true,
            updateError: null
        };
    case actionTypes.UPDATE_PERSONAL_MEETING_SUCCESS:
        return {
            ...state,
            updateLoading: false,
            updateError: null,
            meeting: action.meeting
        };
    case actionTypes.UPDATE_PERSONAL_MEETING_FAILURE:
        return {
            ...state,
            updateLoading: false,
            updateError: action.error
        };
    case actionTypes.CREATE_PERSONAL_MEETING_REQUEST:
        return {
            ...state,
            createLoading: true,
            createError: null
        };
    case actionTypes.CREATE_PERSONAL_MEETING_SUCCESS:
        return {
            ...state,
            createLoading: false,
            createError: null,
            meeting: action.meeting
        };
    case actionTypes.UCREATE_PERSONAL_MEETING_FAILURE:
        return {
            ...state,
            createLoading: false,
            createError: action.error
        };
    case actionTypes.PERSONAL_MEETING_RESET:
        return {
            ...initialState
        };
    default:
        return state;
    }
};
