/* eslint-disable require-jsdoc */

import { setLocalDisplayNameAndEmail } from '../actions/jitsiActions';
import api from '../api';
import * as actionTypes from '../constants/actionTypes';
import { jwt, previousLocationRoomName } from '../functions';

export function updateName(displayName) {
    return {
        type: actionTypes.UPDATE_DISPLAY_NAME,
        displayName
    };
}

function signInRequest() {
    return {
        type: actionTypes.LOGIN_REQUEST
    };
}

export function signInSuccess(token) {
    return async dispatch => {
        jwt.set(token);

        const user = await api.isAuth();

        if (user === null) {
            jwt.remove();
        } else {
            setLocalDisplayNameAndEmail(user);

            dispatch({
                type: actionTypes.LOGIN_SUCCESS,
                user
            });

            const prevPathname = previousLocationRoomName.get();

            if (prevPathname) {
                // navigate to room name
                return prevPathname;
            }
        }
    };
}

function signInFailure(error) {
    return {
        type: actionTypes.LOGIN_FAILURE,
        error
    };
}

export function logout() {
    jwt.remove();

    return {
        type: actionTypes.LOGOUT
    };
}

export function signIn({ email, password }) {
    return async dispatch => {
        dispatch(signInRequest());

        try {
            const res = await api.signIn({ email,
                password });

            return dispatch(signInSuccess(res.token));
        } catch (e) {
            console.error('Error in signIn', e);
            dispatch(signInFailure('Error in SignIn'));
        }
    };
}
