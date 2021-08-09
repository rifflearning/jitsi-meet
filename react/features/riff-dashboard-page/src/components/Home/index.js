/* ******************************************************************************
 * index.js                                                                     *
 * *************************************************************************/ /**
 *
 * @fileoverview Hook up the Home page to redux state and actions
 *
 * The home page doesn't need any hooking up, so this just imports and re-exports
 * the Home component, to make it importable from the directory.
 *
 * Created on       October 22, 2019
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2019-present Riff Learning, Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import { connect } from 'react-redux';

import { getIsUserLoggedIn } from 'Redux/selectors/user';

import { Home } from './Home';

const homeMapProps = {
    mapStateToProps: state => ({
        isUserLoggedIn: getIsUserLoggedIn(state),
    }),
};

const ConnectedHome = connect(homeMapProps.mapStateToProps)(Home);

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    ConnectedHome as Home,
};
