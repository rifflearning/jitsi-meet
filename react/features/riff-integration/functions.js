/* ******************************************************************************
 * functions.js                                                                 *
 * *************************************************************************/ /**
 *
 * @fileoverview riff-integration utility functions
 *
 * Created on       January 3, 2022
 * @author          Jordan Reedie
 *
 * @copyright (c) 2022 Riff Analytics,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

/**
 * Returns an object containing all the state relevant
 * to Riff.
 *
 * @param {Object} state - The redux state object.
 * @returns {Object} - Object with relevant state. Contains:
 * {
 *     displayName,
 *     meetingContext,
 *     meetingTitle,
 *     participant,
 *     room
 * }
 */
function getRiffState(state) {
    const {
        participantId: participant,
        meetingContext,
        meetingTitle,
    } = state['features/riff-integration'];
    const { displayName } = state['features/base/settings'];
    const { room } = state['features/base/conference'];

    return {
        displayName,
        meetingContext,
        meetingTitle,
        participant,
        room,
    };
}

/**
 * Parse a [potentially] multiplexed email value and return
 * the actual email, if provided. Otherwise return input.
 *
 * @param {string} email - The string to parse: we expect either
 *  an actual email or a stringified json object which may contain
 *  an email
 *
 * @returns {string} The parsed email, or the input string on failure
 */
function riffTryParseEmail(email) {
    try {
        const multiplexedEmail = JSON.parse(email);

        // ensure it's an object and not null / other parseable but not-objects
        if (multiplexedEmail && typeof multiplexedEmail === 'object') {
            // if we weren't provided an email in the multiplexed object,
            // just return the input string
            return multiplexedEmail.email ?? email;
        }

        return email;
    } catch (err) {
        return email;
    }
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    getRiffState,
    riffTryParseEmail,
};
