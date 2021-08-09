/* eslint-disable require-jsdoc */

import * as actionTypes from '../constants/actionTypes';

export function toggleMeetingMediator(isOpen) {
    return {
        type: actionTypes.TOGGLE_MEETING_MEDIATOR,
        isOpen
    };
}
