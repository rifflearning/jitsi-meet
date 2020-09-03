/* ******************************************************************************
 * index.js                                                                     *
 * *************************************************************************/ /**
 *
 * @fileoverview Hook up the Signup component to redux state and actions
 *
 * Created on       July 24, 2018
 * @author          Dan Calacci
 * @author          Jordan Reedie
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2018-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import { firebaseLoginSuccess } from 'Redux/actions/user';
import {
    changeDisplayName,
    changeRoomId,
    changeRoomName,
} from 'Redux/actions/chat';
import { getInviteId } from 'Redux/selectors/chat';
import { getIsPersonalMode } from 'Redux/selectors/config';
import { Routes } from 'Redux/constants';

import { SignUpView } from './SignUpView';

const mapStateToProps = state => ({
    inviteId: getInviteId(state),
});

const mapDispatchToProps = dispatch => ({
    firebaseSignupSuccess: (user, inviteId) => {
        // This may be redundant because the firebase listener should also be dispatching
        // login success, but we want to ensure the user is logged in before switching to
        // the metrics page.
        dispatch(firebaseLoginSuccess(user));
        dispatch(changeDisplayName({ displayName: user.displayName }));
        if (!getIsPersonalMode()) {
            dispatch(push(Routes.Chat));
            return;
        }

        // if we had no invite ID or it was the user's room id,
        // redirect to the host page
        if (inviteId === null || inviteId === user.roomId) {
            dispatch(changeRoomId(user.roomId));
            dispatch(changeRoomName(user.roomName));
            dispatch(push(Routes.Host));
        }
        // otherwise, we got here through an invite and should
        // direct the user back to the invitation
        else {
            dispatch(push(`${Routes.Join}/${inviteId}`));
        }
    },
});

const ConnectedSignUp = connect(mapStateToProps, mapDispatchToProps)(SignUpView);

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    ConnectedSignUp as SignUp,
};
