/* ******************************************************************************
 * user_utils.js                                                                *
 * *************************************************************************/ /**
 *
 * @fileoverview User related utils
 *
 * Created on       March 13, 2020
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2020-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

/* ******************************************************************************
 * validateEmail                                                           */ /**
 *
 * Determine if an email is valid
 *
 * This function was found at:
 * http://emailregex.com/
 *
 * As stated on the website, there is no 100% gauranteed way to verify
 * that an email is valid (with regex or on the front-end).
 * But it is advertised as working 99.99% of the time
 * and that should be sufficient for front-end validation.
 *
 * @param {string} email - email address to be validated
 *
 * @returns {boolean} true if the email address passes the validation test
 *      false if it doesn't.
 */
function validateEmail(email) {
    // eslint-disable-next-line max-len
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}


/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    validateEmail,
};
