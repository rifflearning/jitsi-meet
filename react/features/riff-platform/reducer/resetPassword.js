import * as actionTypes from '../constants/actionTypes';

export default (state = {}, action) => {
    switch (action.type) {
    case actionTypes.RESET_REQUEST:
        return { loading: true };
    case actionTypes.RESET_SUCCESS:
        return { success: action.success };
    case actionTypes.RESET_FAILURE:
        return { error: action.error };
    case actionTypes.RESET_HIDE_MESSAGE : {
        return {};
    }

    default:
        return state;
    }
};
