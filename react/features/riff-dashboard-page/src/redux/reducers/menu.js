/* ******************************************************************************
 * menu.js                                                                      *
 * *************************************************************************/ /**
 *
 * @fileoverview Navigation menu redux reducer function
 *
 * Handler for redux actions which modify the navigation menu redux state.
 *
 * Created on       August 26, 2018
 * @author          Dan Calacci
 *
 * @copyright (c) 2018-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import {
    CLOSE_NAV_MENU,
    OPEN_NAV_MENU,
} from '../constants/ActionTypes';
import { ActionTypes } from '../constants';

const initialState = {
    menuOpen: false,
};

const menu = (state = initialState, action) => {
    switch (action.type) {
        case OPEN_NAV_MENU:
            return { ...state, menuOpen: true };

        case CLOSE_NAV_MENU:
            return { ...state, menuOpen: false };

        case ActionTypes.MENU_TOGGLE_VIEW:
            return { ...state, menuOpen: !state.menuOpen };

        default:
            return state;
    }
};

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    menu,
};
