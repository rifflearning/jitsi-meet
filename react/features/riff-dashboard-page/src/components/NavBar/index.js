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

import { toggleNavbarMenu } from 'Redux/actions/menu';
import { userLogout } from 'Redux/actions/user';
import { getIsRiffConnected } from 'Redux/selectors/riff';
import { getInviteId, getWasInvited } from 'Redux/selectors/chat';
import {
    getIsUserLoggedIn,
    getUserAuthType,
    getUserName,
} from 'Redux/selectors/user';
import { getIsPersonalMode } from 'Redux/selectors/config';
import { Routes } from 'Redux/constants';

import { NavBarView } from './NavBarView';

const navBarMapProps = {
    mapStateToProps: state => ({
        isUserLoggedIn: getIsUserLoggedIn(state),
        isRiffConnected: getIsRiffConnected(state),
        isPersonalMode: getIsPersonalMode(),
        authType: getUserAuthType(state),
        wasInvited: getWasInvited(state),
        inviteId: getInviteId(state),
        userName: getUserName(state),
        menuOpen: state.menu.menuOpen,
        inRoom: state.chat.inRoom,
    }),

    mapDispatchToProps: dispatch => ({
        handleLogOut: (/* event */) => {
            dispatch(userLogout());
            dispatch(replace(Routes.Home));
        },

        toggleMenu: (/* event */) => {
            dispatch(toggleNavbarMenu());
        },
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
