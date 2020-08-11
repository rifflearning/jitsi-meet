/* ******************************************************************************
 * index.js                                                                     *
 * *************************************************************************/ /**
 *
 * @fileoverview Hook up the Navbar to redux state and actions
 *
 * Created on       August 1, 2018
 * @author          Dan Calacci
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2018-present Riff Learning, Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import { connect } from 'react-redux';
import { replace } from 'connected-react-router';

import { toggleNavbarMenu } from '../../redux/actions/menu';
import { userLogout } from '../../redux/actions/user';
import { getIsRiffConnected } from '../../redux/selectors/riff';
import { getInviteId, getWasInvited } from '../../redux/selectors/chat';
import {
    getIsUserLoggedIn,
    getUserAuthType,
    getUserName,
} from '../../redux/selectors/user';
import { getIsPersonalMode } from '../../redux/selectors/config';
import { Routes } from '../../redux/constants';

import { NavBarView } from './NavBarView';
import { redirectWithStoredParams } from '../../../app/actions';

const navBarMapProps = {
    mapStateToProps: state => ({
        // isUserLoggedIn: getIsUserLoggedIn(state),
        // isRiffConnected: getIsRiffConnected(state),
        // isPersonalMode: getIsPersonalMode(),
        // authType: getUserAuthType(state),
        // wasInvited: getWasInvited(state),
        // inviteId: getInviteId(state),
        // userName: getUserName(state),
        // menuOpen: state.menu.menuOpen,
        // inRoom: state.chat.inRoom,
        isUserLoggedIn: true,
        isRiffConnected: true,
        isPersonalMode: false,
        authType: 'firebase',
        wasInvited: false,
        inviteId: '',
        userName: APP.store.getState()["features/riff-metrics"].userName || APP.store.getState()["features/riff-metrics"].uid,
        menuOpen: false,
        inRoom: false,
    }),

    mapDispatchToProps: dispatch => ({
        handleLogOut: (/* event */) => {
            // dispatch(userLogout());
            // dispatch(replace(Routes.Home));
        },

        toggleMenu: (/* event */) => {
            // dispatch(toggleNavbarMenu());
        },
        redirectToWelcomePage: () => dispatch(redirectWithStoredParams('/')),
    }),
};

const ConnectedNavBar = connect(navBarMapProps.mapStateToProps,
                                navBarMapProps.mapDispatchToProps)(NavBarView);

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    ConnectedNavBar as NavBar,
};
