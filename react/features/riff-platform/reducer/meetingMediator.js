/* global process */

import * as actionTypes from '../constants/actionTypes';

const initialState = {
    isOpen: process.env.HIDE_MEETING_MEDIATOR_BY_DEFAULT !== 'true'
};

export default (state = initialState, action) => {
    switch (action.type) {
    case actionTypes.TOGGLE_MEETING_MEDIATOR:
        return { ...state,
            isOpen: action.isOpen === undefined ? !state.isOpen : action.isOpen };
    default:
        return state;
    }
};
