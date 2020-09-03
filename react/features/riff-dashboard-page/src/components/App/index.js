/* ******************************************************************************
 * index.js                                                                     *
 * *************************************************************************/ /**
 *
 * @fileoverview Hook up the App page to redux state and actions
 *
 * Created on       March 25, 2020
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2020-present Riff Learning, Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { replace } from 'connected-react-router';

import { startFirebaseLoginListener } from 'Redux/listeners/firebase';
import {
    changeDisplayName,
    changeRoomId,
    changeRoomName,
    setInviteId
} from 'Redux/actions/chat';
import { ltiLoginSuccess, qparamLoginSuccess } from 'Redux/actions/user';
import {
    attemptRiffAuthenticate,
    riffGetIsHostInRoom,
    riffGetRoomFromId,
    updateIsMeetingStarted,
} from 'Redux/actions/riff';
import { getIsRiffConnected } from 'Redux/selectors/riff';
import { logger } from 'libs/utils';

import { App } from './App';

const appMapProps = {
    mapStateToProps: state => ({
        isRiffConnected: getIsRiffConnected(state),
    }),

    mapDispatchToProps: dispatch => ({
        authenticateRiff: () => {
            logger.debug('App:index: attempt data-server auth');
            dispatch(attemptRiffAuthenticate());
        },

        changeRoute: (newPath) => {
            dispatch(replace(newPath));
        },

        ltiUserLoggedIn: ({ user, roomName }) => {
            dispatch(ltiLoginSuccess({ user }));

            // LTI users may only use the specified room name and display name
            // and my not change them.
            dispatch(changeRoomName({ roomName, isUserSettable: false }));
            dispatch(changeDisplayName({ displayName: user.displayName, isUserSettable: false }));
        },

        qparamUserLoggedIn: ({ user, roomName }) => {
            dispatch(qparamLoginSuccess({ user }));

            dispatch(changeRoomName({ roomName }));
            dispatch(changeDisplayName({ displayName: user.displayName }));
        },

        startFirebaseLoginListener: () => {
            // The startFirebaseLoginListener function is a ReduxThunk
            dispatch(startFirebaseLoginListener);
        },

        setRoomName: async (room) => {
            dispatch(changeRoomName({ roomName: room }));
        },

        setInviteId: async (roomId) => {
            dispatch(setInviteId(roomId));
        },

        setRoomId: async (roomId) => {
            const riffRoom = await riffGetRoomFromId(roomId);
            if (riffRoom) {
                dispatch(changeRoomId(roomId));
                const isHostInRoom = await riffGetIsHostInRoom(riffRoom);
                dispatch(changeRoomName({ roomName: riffRoom.title, isUserSettable: false }));
                dispatch(updateIsMeetingStarted(isHostInRoom));
            }
            // TODO - consider how to handle the case where a user passes an invalid room id

        }
    }),

    /* This isn't needed for the App component, but this is a good place to leave
     * this example code for mergeProps.
     * For example to override and call a dispatchProp function passing it values from stateProps
     * -mjl 2020-03-25
    mergeProps: (stateProps, dispatchProps, ownProps) => ({
        ...ownProps,
        ...stateProps,
        ...dispatchProps,
        firebaseSetDisplayNameSuccess: (displayName) => {
            // needed the uid from stateProps in order to update the riffdata participant record
            dispatchProps.firebaseSetDisplayNameSuccess(stateProps.uid, displayName);
        },
    }),
    */
};

const ConnectedApp = withRouter(connect(appMapProps.mapStateToProps,
                                        appMapProps.mapDispatchToProps)(App));

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    ConnectedApp as App,
};
