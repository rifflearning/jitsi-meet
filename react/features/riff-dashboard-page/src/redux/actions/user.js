/* ******************************************************************************
 * user.js                                                                      *
 * *************************************************************************/ /**
 *
 * @fileoverview User redux actions
 *
 * Created on       March 17, 2020
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2020-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import { firebaseLogout, logger } from 'libs/utils';

import { getUserAuthType, getUserEmail } from 'Redux/selectors/user';

import { ActionTypes, AuthTypes } from '../constants';

/* ******************************************************************************
 * firebaseLoginSuccess                                                    */ /**
 * (sync action)
 *
 * A user was successfully logged in by firebase.
 *
 * @param {Object} user - firebase user object w/ uid and other profile values
 *
 * @returns {ReduxAction}
 */
function firebaseLoginSuccess(user) {
    const action = {
        type: ActionTypes.USER_LOGIN_SUCCESS,
        user: {
            authType:      AuthTypes.Firebase,
            uid:           user.uid,
            email:         user.email,
            name:          user.displayName,
            roomName:      user.roomName,
            roomId:        user.roomId,
            emailVerified: user.emailVerified,
        },
    };

    return action;
}

/* ******************************************************************************
 * ltiLoginSuccess                                                         */ /**
 * (sync action)
 *
 * A user was successfully logged in via LTI.
 *
 * @param {Object} user - lti user object w/ uid and other profile values
 *
 * @returns {ReduxAction}
 */
function ltiLoginSuccess({ user }) {
    const action = {
        type: ActionTypes.USER_LOGIN_SUCCESS,
        user: {
            authType:      AuthTypes.Lti,
            uid:           user.uid,
            email:         user.email,
            name:          user.fullName,
        },
    };

    return action;
}

/* ******************************************************************************
 * qparamLoginSuccess                                                      */ /**
 * (sync action)
 *
 * A user was successfully logged in via query parameters.
 *
 * @param {Object} user - qparam user object w/ uid and other profile values
 *
 * @returns {ReduxAction}
 */
function qparamLoginSuccess({ user }) {
    const action = {
        type: ActionTypes.USER_LOGIN_SUCCESS,
        user: {
            authType:      AuthTypes.QueryParam,
            uid:           user.uid,
            email:         user.email,
            name:          user.displayName,
        },
    };

    return action;
}

/* ******************************************************************************
 * userLogout                                                              */ /**
 * (async action)
 *
 * Log out the logged in user.
 *
 * @returns {ReduxThunk}
 */
function userLogout() {
    const logContext = 'actions.user.userLogout';
    const logoutAction = { type: ActionTypes.USER_LOGOUT };

    return async (dispatch, getState) => {
        const state = getState();
        try {
            if (getUserAuthType(state) !== AuthTypes.Firebase) {
                return dispatch(logoutAction);
            }

            logger.debug(`${logContext}: logging out from firebase user ${getUserEmail(state)}`);
            await firebaseLogout();
        }
        catch (err) {
            logger.error(`${logContext}: logging out from firebase user ${getUserEmail(state)}`, { err });
            // we're going to fall through and logout user state even though the firebase
            // logout failed, because that will still do the right thing for the session.
        }

        return dispatch(logoutAction);
    };
}

/* ******************************************************************************
 * userUpdateInfo                                                          */ /**
 * (sync action)
 *
 * Update the user's information. Replacing current values with the new values
 * given. Unspecified fields will be unchanged.
 *
 * @param {{ displayName: string=, roomName: string=, email: string=, emailVerified: boolean= }} newUserInfo
 *
 * @returns {ReduxAction}
 */
function userUpdateInfo(newUserInfo) {
    const action = {
        type: ActionTypes.USER_INFO_UPDATE,
        newUserInfo,
    };

    return action;
}


/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    firebaseLoginSuccess,
    ltiLoginSuccess,
    qparamLoginSuccess,
    userUpdateInfo,
    userLogout,
};
