/* eslint-disable require-jsdoc */
/* eslint-disable valid-jsdoc */
import { riffUtils } from '@rifflearning/riff-metrics';

const { logger } = riffUtils;

function getParticipantName(meeting, participantId) {
    const errPrefix = `riffdata.getParticipantName: Attempted to get name for participant Id: ${
        participantId}`;

    if (!meeting) {
        logger.error(`${errPrefix} when there is no meeting.`);

        return participantId; // Use the participant Id because it's better than no name at all
    }

    const participants = meeting.participants;

    if (!(participants instanceof Map)) {
        logger.error(`${errPrefix} from meeting with incomplete participant data`);

        return participantId; // Use the participant Id because it's better than no name at all
    }

    if (!participants.has(participantId)) {
        logger.error(`${errPrefix} which does not exist in the current meeting.`);

        return participantId; // Use the participant Id because it's better than no name at all
    }

    return participants.get(participantId)?.name || '';
}

/* ******************************************************************************
 * formatDuration                                                          */ /**
 *
 * Generate a readable string to represent a time duration ex. 2m 45s.
 *
 * @param {number} durationInSeconds - The duration in seconds.
 *
 * @returns {string} The formatted duration string.
 */
function formatDuration(durationInSeconds) {

    let seconds = durationInSeconds;
    const minutes = Math.trunc(durationInSeconds / 60);

    seconds = Math.round(durationInSeconds % 60);

    const minutesString = minutes > 0 ? `${Math.trunc(minutes)}m` : '';

    const formattedDuration = `${minutesString} ${Math.round(seconds % 60)}s`;

    return formattedDuration;
}

/* ******************************************************************************
 * getDurationInSeconds                                                    */ /**
 *
 * Returns the time difference in seconds between the given
 * start and end times.
 *
 * @param {Date | string | number} startTime - An acceptable start time for the
 *                                             javascript date constructor.
 * @param {Date | string | number} endTime - An acceptable end time for the
 *                                           javascript date constructor.
 *
 * @returns {number} The difference in seconds.
 */
function getDurationInSeconds(startTime, endTime) {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationSecs = (end.getTime() - start.getTime()) / 1000;

    return durationSecs;
}

/**
 * Enable or disable the ability to scroll the html element.
 *
 * Since disabling scrolling removes the scrollbar, add padding to the html
 * element that is equal to the width of the scroll bar.
 *
 * TODO: Perhaps add an arg to determine if 'auto' or 'scroll' should be used
 *       as the value for overflow-y when enabling the window scrollbar
 *       for now we just use 'auto' letting the user agent determine what to
 *       do when there is no overflow.
 *
 * @param {boolean} enableScrolling - Should window scrolling be enabled or disabled.
 */
function setWindowScrolling(enableScrolling) {
    const htmlElement = document.documentElement;

    if (enableScrolling) {
        htmlElement.style.cssText = 'overflow-y: auto; padding-right: 0;';
    } else {
        const scrollBarWidth = window.innerWidth - htmlElement.offsetWidth;

        htmlElement.style.cssText = `overflow-y: hidden; padding-right: ${scrollBarWidth}px;`;
    }
}

export {
    getParticipantName,
    getDurationInSeconds,
    formatDuration,
    setWindowScrolling
};
