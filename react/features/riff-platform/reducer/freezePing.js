/* eslint-disable indent */
/* eslint-disable object-property-newline */

import * as actionTypes from '../constants/actionTypes';

const initialState = {
    isActive: true
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.TOGGLE_FREEZE_PING:
            return { ...state, isActive: !state.isActive };
        default:
            return state;
    }
};
