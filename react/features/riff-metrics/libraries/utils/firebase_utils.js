/* ******************************************************************************
 * firebase_utils.js                                                            *
 * *************************************************************************/ /**
 *
 * @fileoverview Firebase utility functions
 *
 * These firebase utilities also define the firebaseApp. This used to be done
 * in a separate module libs/firebase-app.js. That was merged into this file
 * in order to help resolve some circular dependency issues.
 * firebaseApp is exported from this module BUT it is not imported/re-exported
 * by the utils/index file. While it is still used directly elsewhere the
 * eventual goal is to define utility functions for all uses of the firebaseApp.
 *
 * Created on       March 19, 2020
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2020-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/


// This import loads the firebase namespace along with all its type information.
import firebase from 'firebase/app';

// These imports load individual services into the firebase namespace.
// (in our case only the single auth service)
import 'firebase/auth';

import { getFirebaseConfig } from '../../redux/selectors/config';

import { logger } from './logger';
import { validateEmail } from './user_utils';


const config = getFirebaseConfig();
const firebaseApp = firebase.initializeApp(config);

/* **************************************************************************
 * firebaseLogin                                                       */ /**
 *
 * Attempt to authenticate a firebase user w/ email/password
 *
 * @param {string} email - email address of the user logging in
 * @param {string} pswd - password of the user logging in
 *
 * @returns {Promise<FirebaseUser>}
 */
async function firebaseLogin(email, pswd) {
    try {
        const resp = await firebaseApp.auth().signInWithEmailAndPassword(email, pswd);
        return resp.user;
    }
    catch (err) {
        throw updateErrorMessage(err);
    }
}

/* **************************************************************************
 * firebaseLogout                                                      */ /**
 *
 * Attempt to logout the logged in firebase user.
 *
 * @returns {Promise<void>}
 */
function firebaseLogout() {
    return firebaseApp.auth().signOut();
}

/* **************************************************************************
 * isNewUser                                                           */ /**
 *
 * is this the first time the firebase user has signed in?
 *
 * @returns {boolean}
 */
function isNewUser(user) {
    return user.metadata.creationTime === user.metadata.lastSignInTime;
}

/* **************************************************************************
 * firebaseSendResetLink                                               */ /**
 *
 * Have firebase send a password reset link for the user with the given
 * email to that email address.
 *
 * @param {string} email - email address of the user to send reset link to
 *
 * @returns {Promise<undefined>}
 */
async function firebaseSendResetLink(email) {
    try {
        if (!validateEmail(email)) {
            throw { code: 'auth/invalid-email' };
        }

        await firebaseApp.auth().sendPasswordResetEmail(email);
    }
    catch (err) {
        throw updateErrorMessage(err);
    }
}

/* ******************************************************************************
 * firebaseCreateUser                                                      */ /**
 *
 * Create a new firebase user with the given email and password, and set their
 * display name to the given name.
 *
 * @param {Object} user
 * @param {string} user.email
 * @param {string} user.password
 * @param {string} user.displayName
 *
 * @returns {Promise<FirebaseUser>}
 */
async function firebaseCreateUser({ email, password, displayName }) {
    try {
        // firebase password requirements are not configurable,
        // and default minimum password length is 6
        // so we have to handle that here
        // TODO we have set to 6 until we implement
        // custom password reset forms
        if (password.length < 6) {
            throw { code: 'auth/weak-password' };
        }

        const usercred = await firebaseApp.auth().createUserWithEmailAndPassword(email, password);
        const firebaseUser = usercred.user;
        await firebaseUser.updateProfile({ displayName });

        // We could send the email verification, but right now we don't care if the email is
        // verified or not.
        // user.sendEmailVerification();

        return firebaseUser;
    }
    catch (err) {
        throw updateErrorMessage(err);
    }
}

/* ******************************************************************************
 * firebaseSetCurUserDisplayName                                           */ /**
 *
 * Set the display name of the current firebase user to the given name.
 *
 * @param {string} newDisplayName
 *
 * @returns {Promise<FirebaseUser>}
 */
async function firebaseSetCurUserDisplayName(newDisplayName) {
    try {
        const firebaseUser = firebaseApp.auth().currentUser;
        await firebaseUser.updateProfile({ displayName: newDisplayName });
        return firebaseUser;
    }
    catch (err) {
        throw updateErrorMessage(err);
    }
}

/* **************************************************************************
 * updateErrorMessage                                                  */ /**
 *
 * Modify the error object returned by firebase when the login attempt
 * fails to have a friendlier message to be displayed to the user.
 *
 * @param {Object} error - error object returned when firebase login attempt
 *      fails.
 *
 * @returns {Object} modified error object
 */
function updateErrorMessage(error) {
    const updatedError = Object.assign({}, error);
    switch (updatedError.code) {
        case 'auth/email-already-in-use':
            updatedError.message = 'This email address is already in use.';
            updatedError.type = 'email';
            break;

        case 'auth/invalid-email':
            updatedError.message = 'Please provide a valid email address.';
            updatedError.type = 'email';
            break;

        case 'auth/weak-password':
            updatedError.message = 'Password must be at least six characters long.';
            updatedError.type = 'password';
            break;

        // display same message for these cases
        case 'auth/too-many-requests':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
            updatedError.message = 'Email / password combination not found!';
            updatedError.type = 'login';
            break;

        default:
            logger.warn('filebase_utils.updateErrorMessage: unexpected error message: ', error);
            // leave error at default error state
    }

    return updatedError;
}


/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    firebaseApp,
    firebaseCreateUser,
    firebaseLogin,
    firebaseLogout,
    firebaseSendResetLink,
    firebaseSetCurUserDisplayName,
    isNewUser,
};
