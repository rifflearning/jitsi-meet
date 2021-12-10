/* global riffConfig */

import * as actionTypes from '../constants/actionTypes';

const initialState = {
    isOpen: riffConfig.meeting.showMediatorOnJoinRegistered
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
