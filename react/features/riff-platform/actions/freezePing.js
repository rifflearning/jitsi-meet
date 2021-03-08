/* eslint-disable require-jsdoc */

import * as actionTypes from '../constants/actionTypes';

export function toggleFreezePing() {
    return {
        type: actionTypes.TOGGLE_FREEZE_PING
    };
}
