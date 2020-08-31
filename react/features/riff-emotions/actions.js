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
        const link = location.hostname === 'localhost' ? 'https://riff-poc.riffplatform.com/' : '';
        const socket = io(link, { path: '/emotions-server' });

        socket.on('emotions data', data => dispatch(setEmotionsData(data)));
    };
}
