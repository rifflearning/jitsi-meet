/* ******************************************************************************
 * index.js                                                                     *
 * *************************************************************************/ /**
 *
 * @fileoverview React Profile component attached to the router and redux store
 *
 * Created on       Aug 2, 2018
 * @author          Jordan Reedie
 * @author          Dan Calacci
 * @author          Mike Lippert
 *
 * @copyright (c) 2018-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import { connect } from 'react-redux';

import { app as riffServer } from 'libs/riffdata-client';
import { userUpdateInfo } from 'redux/actions/user';
import { changeDisplayName } from 'redux/actions/chat';
import {
    getUserEmail,
    getUserId,
    getUserName,
    getUserRoomName,
} from 'redux/selectors/user';

import { ProfileView } from './ProfileView';


const profileMapProps = {
    mapStateToProps: state => ({
        uid: getUserId(state),
        email: getUserEmail(state),
        displayName: getUserName(state),
        roomName: getUserRoomName(state),
    }),

    mapDispatchToProps: dispatch => ({
        firebaseSetDisplayNameSuccess: (uid, displayName) => {
            dispatch(userUpdateInfo({ name: displayName }));

            // update the participant's name in the riffdata server so the dashboard
            // stats have the correct labels. patch returns a promise, but we don't
            // care about the results so we ignore it
            riffServer.service('participants').patch(uid, { name: displayName })
                .catch(() => undefined /* ignore errors from patch */);

            dispatch(changeDisplayName({ displayName }));
        },

        changeRoomName: (roomName) => {
            dispatch(userUpdateInfo({ roomName }));
        }

    }),

    /* This turns out to be unnecessary because the uid can be gotten from the
     * returned firebaseUser after updating the displayname
     * I'm leaving this code here as a good example of mergeProps. -mjl 2020-03-21
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

const ConnectedProfile = connect(profileMapProps.mapStateToProps,
                                 profileMapProps.mapDispatchToProps)(ProfileView);

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    ConnectedProfile as Profile,
};
