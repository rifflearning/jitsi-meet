/* ******************************************************************************
 * menu.js                                                                      *
 * *************************************************************************/ /**
 *
 * @fileoverview Navbar menu redux actions
 *
 * Created on       March 26, 2020
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2020-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import { ActionTypes } from '../constants';

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
function toggleNavbarMenu() {
    const action = {
        type: ActionTypes.MENU_TOGGLE_VIEW,
    };

    return action;
}


/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    toggleNavbarMenu,
};
