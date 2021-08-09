/* ******************************************************************************
 * routes.js                                                                    *
 * *************************************************************************/ /**
 *
 * @fileoverview Enumeration of the supported react routes
 *
 * Created on       March 24, 2020
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2020-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

/**
 * Routes for this Riff Platform single page app.
 * @enum {string}
 */
const Routes = {
    /** Home page */
    Home: '/home',

    /** Video chat page for teams mode */
    Chat: '/room',

    /** Video chat page for joining meeting in personal mode */
    Join: '/join',

    /** Video chat page for hosting meeting in personal mode */
    Host: '/host',

    /** Metrics page */
    Metrics: '/riffs',

    /** Firebase signin page */
    SignIn: '/login',

    /** Firebase signup page */
    SignUp: '/signup',

    /** User profile page */
    UserProfile: '/profile',
};

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    Routes,
};
