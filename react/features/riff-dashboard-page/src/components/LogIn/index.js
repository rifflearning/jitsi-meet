/* ******************************************************************************
 * index.js                                                                     *
 * *************************************************************************/ /**
 *
 * @fileoverview Hook up the Login to redux state and actions
 *
 * Created on       August 2, 2018
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

import { changeDisplayName } from 'redux/actions/chat';
import { getInviteId } from 'redux/selectors/chat';
import { getIsPersonalMode } from 'redux/selectors/config';
import { firebaseLoginSuccess } from 'redux/actions/user';
import { Routes } from 'redux/constants';

import { LogInView } from './LogInView';
import { LogInForm } from './LogInForm';

const mapStateToProps = state => ({
    inviteId: getInviteId(state)
});

const mapDispatchToProps = dispatch => ({
    firebaseLoginSuccess: (user, inviteId) => {
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
            dispatch(push(Routes.Host));
        }
        // otherwise, we got here through an invite and should
        // direct the user back to the invitation
        else {
            dispatch(push(`${Routes.Join}/${inviteId}`));
        }
    },
});

const ConnectedLogInForm = connect(mapStateToProps, mapDispatchToProps)(LogInForm);

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    LogInView as LogIn,
    ConnectedLogInForm as LogInForm,
};
