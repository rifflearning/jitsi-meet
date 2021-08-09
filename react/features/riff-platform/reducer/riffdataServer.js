import * as actionTypes from '../constants/actionTypes';

const initialState = {
    authToken: null,
    authError: null
};

export default (state = initialState, action) => {
    switch (action.type) {
    case actionTypes.RIFF_SERVER_AUTHENTICATE_SUCCESS:
        return { ...state,
            authToken: action.token,
            authError: null };

    case actionTypes.RIFF_SERVER_AUTHENTICATE_FAIL:
        return { ...state,
            authToken: null,
            authError: action.error };

    default:
        return state;
    }
};
