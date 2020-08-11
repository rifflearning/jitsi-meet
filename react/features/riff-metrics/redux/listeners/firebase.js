/* ******************************************************************************
 * firebase.js                                                                  *
 * *************************************************************************/ /**
 *
 * @fileoverview Listen for firebase user authentication events and dispatch actions
 *
 * Created on       August 14, 2018
 * @author          Dan Calacci
 *
 * @copyright (c) 2018-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import { logger } from '../../libraries/utils';
import { firebaseApp, isNewUser } from '../../libraries/utils/firebase_utils';
import { changeRoomId, changeRoomName } from '../../redux/actions/chat';
import { riffCreatePersonalRoom, riffGetRoomFromUser } from '../../redux/actions/riff';
import { firebaseLoginSuccess } from '../../redux/actions/user';
import { AuthTypes } from '../../redux/constants';
import { getIsPersonalMode } from '../../redux/selectors/config';
import {
    getIsUserLoggedIn,
    getUserAuthType,
    getUserEmail,
    getUserId
} from '../../redux/selectors/user';


function startFirebaseLoginListener(dispatch, getState) {

    firebaseApp.auth().onAuthStateChanged(async user => {
        if (user === null) {
            logger.info('FirebaseListener: No signed in user');
        } else if (user.isAnonymous) {
            // We do not support anonymous users (anymore) so report it as a warning
            logger.warn('FirebaseListener: An anonymous user signed in!', user.uid);

            // this returns a promise but we're just being thorough we don't really care if it
            // fails to sign out the anonymous user
            firebaseApp.auth().signOut();
        } else {
            logger.debug('FirebaseListener: A named user signed in', { displayName: user.displayName,
                email: user.email,
                verified: user.emailVerified,
                uid: user.uid });
            const state = getState();


            // if the user isn't logged in already and we're in firebase auth mode
            if (!getIsUserLoggedIn(state) || getUserAuthType(state) === AuthTypes.Firebase) {
                // if we're in personal mode we need to make sure we have a room for the user
                // and add it to their user object
                if (getIsPersonalMode()) {
                    let room = await riffGetRoomFromUser(user.uid);


                    // if this is a new user and a room hasn't been created yet, it will be
                    // handled elsewhere. just eject
                    // this is a little janky but necessary for now
                    if (isNewUser(user) && room === null) {
                        return;
                    }

                    if (room === null) {
                        // since they don't have the option to name their room
                        // create a room based on their display name
                        const roomName = `${user.displayName}'s Room`;

                        room = await riffCreatePersonalRoom({ ...user,
                            roomName });
                    }

                    dispatch(firebaseLoginSuccess({
                        ...user,
                        roomId: room._id,
                        roomName: room.title
                    }));

                    // we need to make sure we have a room id / name set for chat on login
                    // this will already be populated if we got here via invite,
                    // so no worry of overwriting an invited room id
                    if (state.chat.roomId === null) {
                        dispatch(changeRoomId(room._id));
                        dispatch(changeRoomName(room.title));
                    }
                } else {
                    dispatch(firebaseLoginSuccess(user));
                }
            } else {
                const warnInfo = {
                    firebaseUser: { displayName: user.displayName,
                        email: user.email,
                        verified: user.emailVerified,
                        uid: user.uid },
                    currentUser: { authType: getUserAuthType(state),
                        uid: getUserId(state),
                        email: getUserEmail(state) }
                };

                logger.warn('FirebaseListener: A user with a different AuthType is already logged in. '
                            + 'The firebase user login will be ignored.', warnInfo);
            }
        }
    });
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    startFirebaseLoginListener
};
