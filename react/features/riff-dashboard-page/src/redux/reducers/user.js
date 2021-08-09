/* ******************************************************************************
 * user.js                                                                      *
 * *************************************************************************/ /**
 *
 * @fileoverview User redux reducer function
 *
 * Handler for redux actions which modify the user redux state.
 *
 * Created on       March 17, 2020
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2020-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import { ActionTypes, AuthTypes } from '../constants';

import { logger } from 'libs/utils';

const initialState = {
    /** The authorization type of the user id,
     *  ie where the uid came from: firebase login, lti login, url param login
     *  or type None when no user is logged in
     */
    authType: AuthTypes.None,

    /** The unique ID for this user, used to identify them in riff meetings
     *  when null no user is logged in
     */
    uid: null,

    /** The email address this user used to register, empty string if unknown */
    email: '',

    /** The display name this user specified when registering, empty string if unknown */
    name: '',

    /** The room name this user specified when registering, empty string if unknown */
    roomName: '',

    /** The ID of the user's personal room, or null if unknown */
    roomId: null,

    /** If the user has verified their email address this will be true.
     *  It is currently only relevant to firebase logins to allow for
     *  password reset. Upon further inspection I'm not sure it's needed for
     *  password reset so why should we care about the email verified state -mjl
     */
    emailVerified: false,
};


/* ******************************************************************************
 * user                                                                    */ /**
 *
 * Redux reducer function for user state.
 */
function user(state = initialState, action) {
    switch (action.type) {
        case ActionTypes.USER_LOGIN_SUCCESS: {
            const userinfo = action.user;
            const newUser = {
                ...initialState,
                authType:      userinfo.authType,
                uid:           userinfo.uid || null,
                email:         userinfo.email || '',
                name:          userinfo.name || '',
                roomName:      userinfo.roomName || '',
                roomId:        userinfo.roomId || null,
                emailVerified: userinfo.emailVerified === true, // anything other than true is unverified
            };

            logger.debug('reducer.user: user login success');
            if (userChanged(state, newUser)) {
                logger.debug('reducer.user: changed user login');
                return newUser;
            }
            break;
        }

        case ActionTypes.USER_INFO_UPDATE: {
            // Note that authType AND uid may not be updated except by a new login

            const newUser = { ...state };

            // only update user fields if they are specified AND the correct type
            if (typeof action.newUserInfo.email === 'string') {
                newUser.email = action.newUserInfo.email;
            }
            if (typeof action.newUserInfo.name === 'string') {
                newUser.name = action.newUserInfo.name;
            }
            if (typeof action.newUserInfo.roomName === 'string') {
                newUser.roomName = action.newUserInfo.roomName;
            }
            if (typeof action.newUserInfo.roomId === 'string') {
                newUser.roomId = action.newUserInfo.roomId;
            }
            if (typeof action.newUserInfo.emailVerified === 'boolean') {
                newUser.emailVerified = action.newUserInfo.emailVerified;
            }

            logger.debug('reducer.user: user info update');
            if (userChanged(state, newUser)) {
                logger.debug('reducer.user: user updated');
                return newUser;
            }
            break;
        }

        case ActionTypes.USER_LOGOUT:
            return initialState;
    }
    return state;
}

/* ******************************************************************************
 * userChanged                                                             */ /**
 *
 * Local module function to compare 2 user state objects to determine if they
 * are the same or different.
 *
 * @param {UserState} userState1 - first user state
 * @param {UserState} userState2 - other user state
 *
 * @returns {boolean}
 */
function userChanged(userState1, userState2) {
    /* eslint-disable no-multi-spaces */
    const isChanged =
        userState1.authType      !== userState2.authType     ||
        userState1.uid           !== userState2.uid          ||
        userState1.email         !== userState2.email        ||
        userState1.name          !== userState2.name         ||
        userState1.roomName      !== userState2.roomName     ||
        userState1.roomId        !== userState2.roomId       ||
        userState1.emailVerified !== userState2.emailVerified;
    /* eslint-enable no-multi-spaces */

    logger.debug('reducer.user.userChanged: args:', { isChanged, userState1, userState2 });
    return isChanged;
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    user,
};
