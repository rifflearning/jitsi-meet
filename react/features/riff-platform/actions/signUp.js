/* eslint-disable require-jsdoc */

import api from '../api';
import * as actionTypes from '../constants/actionTypes';

function signUpRequest() {
    return {
        type: actionTypes.REGISTER_REQUEST
    };
}

function signUpSuccess() {
    return {
        type: actionTypes.REGISTER_SUCCESS
    };
}

function signUpFailure(error) {
    return {
        type: actionTypes.REGISTER_FAILURE,
        error
    };
}

export function signUp({ email, password, name }) {
    return async dispatch => {
        dispatch(signUpRequest());

        try {
            const res = await api.signUp({ name,
                email,
                password });

            dispatch(signUpSuccess());

            return res;
        } catch (e) {
            if (e.status === 401) {
                dispatch(signUpFailure('User already exists'));
            } else {
                dispatch(signUpFailure('Error in signUp'));
            }
        }
    };
}

