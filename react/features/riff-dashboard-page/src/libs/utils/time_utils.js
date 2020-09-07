/* ******************************************************************************
 * time_utils.js                                                                *
 * *************************************************************************/ /**
 *
 * @fileoverview Time related utils
 *
 * Created on       March 13, 2020
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2020-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

/* ******************************************************************************
 * getDurationInSeconds                                                    */ /**
 *
 * Returns the time difference in seconds between the given
 * start and end times.
 *
 * @param {Date | string | number} startTime - an acceptable start time for the
 *                                             javascript date constructor
 * @param {Date | string | number} endTime - an acceptable end time for the
 *                                           javascript date constructor
 *
 * @returns {number} the difference in seconds
 */
function getDurationInSeconds(startTime, endTime) {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationSecs = (end.getTime() - start.getTime()) / 1000;
    return durationSecs;
}

/* ******************************************************************************
 * formatDuration                                                          */ /**
 *
 * Generate a readable string to represent a time duration ex. 2m 45s
 *
 * @param {number} durationInSeconds the duration in seconds
 *
 * @returns {string} the formatted duration string
 */
function formatDuration(durationInSeconds) {

    let seconds = durationInSeconds;
    const minutes = Math.trunc(durationInSeconds / 60);
    seconds = Math.round(durationInSeconds % 60);

    const minutesString = minutes > 0 ? `${Math.trunc(minutes)}m` : ``;

    const formattedDuration = `${minutesString} ${Math.round(seconds % 60)}s`;

    return formattedDuration;
}


/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    formatDuration,
    getDurationInSeconds,
};
