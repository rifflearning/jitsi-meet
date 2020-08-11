/* ******************************************************************************
 * authtype.js                                                                  *
 * *************************************************************************/ /**
 *
 * @fileoverview [summary of file contents]
 *
 * [More detail about the file's contents]
 *
 * Created on       March 17, 2020
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2020-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

/**
 * Authenticator types for the logged in user.
 * @enum {string}
 */
const AuthTypes = {
    /** Should only be used when no user is logged in. */
    None: 'none',

    /** User was authenticated by Firebase login. */
    Firebase: 'firebase',

    /** User was authenticated via Lti from an Lms. */
    Lti: 'lti',

    /** User was authenticated (if you can call it that) via query parameters (ie qualtrics login link). */
    QueryParam: 'qparam',
};

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    AuthTypes,
};
