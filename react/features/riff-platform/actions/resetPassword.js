/* eslint-disable require-jsdoc */

import api from '../api';
import * as actionTypes from '../constants/actionTypes';


function resetPasswordRequest() {
    return {
        type: actionTypes.RESET_REQUEST
    };
}

function resetPasswordSuccess(success) {
    return {
        type: actionTypes.RESET_SUCCESS,
        success
    };
}

function resetPasswordFailure(error) {
    return {
        type: actionTypes.RESET_FAILURE,
        error
    };
}

export function resetPasswordVerify({ token, password }) {
    return async dispatch => {
        dispatch(resetPasswordRequest());

        try {
            await api.resetPasswordVerify({ token,
                password });

            // eslint-disable-next-line max-len
            return dispatch(resetPasswordSuccess('The password has successfully been changed. You can now login with the new password. You will land to login page in 5 seconds'));

        } catch (e) {
            dispatch(resetPasswordFailure('Error in reset password, try again'));
        }
    };
}

export function resetPassword({ email }) {
    return async dispatch => {
        dispatch(resetPasswordRequest());

        try {
            await api.resetPassword({ email });

            // eslint-disable-next-line max-len
            return dispatch(resetPasswordSuccess('Please, verify email to change the password.'));

        } catch (e) {
            if (e.status === 404) {
                dispatch(resetPasswordFailure('User does not exist. Please sign up first.'));
            } else {
                dispatch(resetPasswordFailure('Error in reset password'));
            }
        }
    };
}

export function hideResetMessage() {
    return {
        type: actionTypes.RESET_HIDE_MESSAGE
    };
}

