import * as actionTypes from '../constants/actionTypes';

export default (state = {}, action) => {
    switch (action.type) {
    case actionTypes.MEETING_REQUEST:
        return { loading: true };
    case actionTypes.MEETING_SUCCESS:
        return { meeting: action.meeting };
    case actionTypes.MEETING_FAILURE:
        return { error: action.error };
    case actionTypes.MEETING_RESET:
        return {};

    default:
        return state;
    }
};
