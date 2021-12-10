import * as actionTypes from '../constants/actionTypes';

export default (state = {}, action) => {
    switch (action.type) {
    case actionTypes.REGISTER_REQUEST:
        return { loading: true };
    case actionTypes.REGISTER_SUCCESS:
        return {};
    case actionTypes.REGISTER_FAILURE:
        return { error: action.error };

    default:
        return state;
    }
};
