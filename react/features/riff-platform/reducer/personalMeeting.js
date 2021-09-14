import * as actionTypes from '../constants/actionTypes';

export default (state = {}, action) => {
    switch (action.type) {
    case actionTypes.PERSONAL_MEETING_REQUEST:
        return { loading: true };
    case actionTypes.PERSONAL_MEETING_SUCCESS:
        return { meeting: action.meeting };
    case actionTypes.PERSONAL_MEETING_FAILURE:
        return { error: action.error };
    default:
        return state;
    }
};
