/* global riffConfig */
import * as actionTypes from '../constants/actionTypes';
import { app } from '../libs/riffdata-client';

export const riffServerAuthSuccess = token => {
    return {
        type: actionTypes.RIFF_SERVER_AUTHENTICATE_SUCCESS,
        token
    };
};

export const riffServerAuthFail = err => {
    return {
        type: actionTypes.RIFF_SERVER_AUTHENTICATE_FAIL,
        error: err
    };
};

export const loginToRiffDataServer = () => dispatch => {
    app.authenticate({
        strategy: 'local',
        email: riffConfig.riffdata.email,
        password: riffConfig.riffdata.password
    })
    .then(result => {
        dispatch(riffServerAuthSuccess(result.accessToken));
    })
    .catch(err => {
        dispatch(riffServerAuthFail(err));
        dispatch(loginToRiffDataServer());
    });
};
