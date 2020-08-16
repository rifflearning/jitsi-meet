/* eslint-disable require-jsdoc */
import io from 'socket.io-client';

import * as actionTypes from './actionTypes';

export function setEmotionsData(dataObj) {
    return {
        type: actionTypes.SET_EMOTIONS_DATA,
        payload: dataObj
    };
}

export function subscribeToEmotionsData() {
    return dispatch => {
        const socket = io('https://sg0xm.sse.codesandbox.io/');
        // const socket = io();

        socket.on('emotions data', data => dispatch(setEmotionsData(data)));
    };
}
