/* ******************************************************************************
 * MeetingInfo.jsx                                                              *
 * *************************************************************************/ /**
 *
 * @fileoverview React component that displays information about a meeting
 *
 * [More detail about the file's contents]
 *
 * Created on       June 20, 2019
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2019-present Riff Learning Inc.,
 *                MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import React from 'react';
import PropTypes from 'prop-types';
import { ScaleLoader } from 'react-spinners';

import { d3 } from 'libs/d3';
import {
    Colors,
    logger,
} from 'libs/utils';


const MILLISEC_PER_MINUTE = 1000 * 60;

// Define special non-ascii characters
const spiralCalendarPad = '\u{1f5d3}';          // 🗓 SPIRAL CALENDAR PAD
const stopwatch = '\u23f1';                     // ⏱ STOPWATCH
const happyPersonRaisingOneHand = '\u{1f64b}';  // 🙋 HAPPY PERSON RAISING ONE HAND
const zeroWidthJoiner = '\u200d';               // ‍ ZERO WIDTH JOINER
const maleSign = '\u2642';                      // ♂️ MALE SIGN
const emojiVariationSelector16 = '\ufe0f';      // VARIATION SELECTOR-16
const emojiManRaisingHand = `${happyPersonRaisingOneHand}${zeroWidthJoiner}${maleSign}${emojiVariationSelector16}`;

/* ******************************************************************************
 * MeetingInfo                                                             */ /**
 *
 * React component that displays information about a meeting
 *
 ********************************************************************************/
class MeetingInfo extends React.PureComponent {
    static propTypes = {

        /** meeting whose stats will be in meetingStats */
        meeting: PropTypes.shape({
            _id: PropTypes.string.isRequired,
            room: PropTypes.string,
            startTime: PropTypes.string.isRequired,
            endTime: PropTypes.string,
            participants: PropTypes.instanceOf(Set).isRequired,
        }),
    };

    /* **************************************************************************
     * render                                                              */ /**
     *
     * Required method of a React component.
     * @see {@link https://reactjs.org/docs/react-component.html#render|React.Component.render}
     */
    render() {
        if (!this.props.meeting) {
            // devnote: the height is being set just by eyeballing how it looks
            const loadingDisplay = (
                <div className='level' style={{ height: '96pt', width: '25vw' }}>
                    <ScaleLoader color={Colors.lightRoyal}/>
                </div>
            );

            return loadingDisplay;
        }

        const roomName = this.props.meeting.room;

        const meetingInfo = (
            <div className='meeting-info-component'>
                <h1 className='meeting-name'>
                    {roomName}
                </h1>
                <div className='meeting-details'>
                    <h2>
                        <i>{spiralCalendarPad}</i>
                        {formatStartTime(this.props.meeting.startTime)}
                    </h2>
                    <h2>
                        <i>{stopwatch}</i>
                        {this._getFormattedMeetingDuration()}
                    </h2>
                    <h2>
                        <i>{emojiManRaisingHand}</i>
                        {`${this.props.meeting.participants.size} Attendee(s)`}
                    </h2>
                </div>
            </div>
        );

        return meetingInfo;
    }

    /* **************************************************************************
     * _getFormattedMeetingDuration                                        */ /**
     *
     * [Description of _getFormattedMeetingDuration]
     *
     * @returns {string} the formatted length of the meeting
     */
    _getFormattedMeetingDuration() {
        if (this.props.meeting === null) {
            return '';
        }

        // 'in progress' meetings have a null endTime, we'll calculate the duration of those
        // meetings by giving them a fake end time of now
        logger.debug('MeetingInfo: _getFormattedMeetingDuration: meeting', this.props.meeting);

        const meeting = this.props.meeting;
        const startDate = new Date(meeting.startTime);
        const endDate = meeting.endTime ? new Date(meeting.endTime) : new Date();
        const durationMins = Math.trunc((endDate.getTime() - startDate.getTime()) / MILLISEC_PER_MINUTE);

        return `${durationMins} minutes`;
    }
}

/** Use d3 to create a datetime formatter for the start time */
const d3FormatStartTime = d3.timeFormat('%m/%d/%y %I:%M %p');

/* ******************************************************************************
 * formatStartTime                                                         */ /**
 *
 * We want to adjust the date time format produced by the d3 time formatter
 * in a minor way, by lowercasing the AM/PM indicator.
 *
 * @param {Date | string | number} dt - anything acceptable to the Date constructor
 *
 * @returns {string}
 */
function formatStartTime(dt) {
    const baseFormattedTime = d3FormatStartTime(new Date(dt));
    const formattedStartTime = baseFormattedTime.slice(0, -2) + baseFormattedTime.slice(-2).toLowerCase();
    return formattedStartTime;
}


/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    MeetingInfo,
};
