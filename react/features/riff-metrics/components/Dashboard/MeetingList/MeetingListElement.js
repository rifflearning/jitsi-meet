/* ******************************************************************************
 * MeetingListElement.jsx                                                       *
 * *************************************************************************/ /**
 *
 * @fileoverview React Riff Meeting List component
 *
 * [More detail about the file's contents]
 *
 * Created on       May 29, 2019
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2019-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import React from 'react';
import PropTypes from 'prop-types';
import { ScaleLoader } from 'react-spinners';

import { d3 } from '../../../libraries/d3';

import { Colors } from '../../../libraries/utils';

/* ******************************************************************************
 * MeetingListElement                                                      */ /**
 *
 * React component to present a meeting in a list of meetings.
 *
 ********************************************************************************/
class MeetingListElement extends React.Component {
    static propTypes = {

        /** The meeting object to be presented */
        meeting: PropTypes.object.isRequired,

        /** whether the meeting is the currently selected meeting */
        selected: PropTypes.bool.isRequired,

        /** function to invoke when this meeting is clicked on (will select the meeting) */
        handleClick: PropTypes.func.isRequired,

        /** function to invoke when this meeting is clicked on (will select the meeting) */
        roomName: PropTypes.string.isRequired,

        /** is the graphical rendering for all graphs on the dashboard complete? */
        areAllGraphsRendered: PropTypes.bool.isRequired,
    };

    /* **************************************************************************
     * shouldComponentUpdate                                               */ /**
     */
    shouldComponentUpdate(nextProps) {
        if (!this.props.selected && !nextProps.selected) {
            return false;
        }

        return true;
    }

    /* **************************************************************************
     * render                                                              */ /**
     *
     * Required method of a React component.
     * @see {@link https://reactjs.org/docs/react-component.html#render|React.Component.render}
     */
    render() {
        const meetingTime = MeetingListElement._formatMeetingTime(this.props.meeting.startTime);

        let loadingDisplay = null;
        if (!this.props.areAllGraphsRendered && this.props.selected) {
            loadingDisplay = (
                <div className='loading-overlay'>
                    <ScaleLoader color={Colors.lightRoyal}/>
                </div>
            );
        }

        let selectedClass = '';
        if (this.props.selected) {
            selectedClass = 'is-selected';
        }
        return (
            <div
                className={`meeting-list-element-component ${selectedClass}`}
                onClick={(/* event */) => this.props.handleClick(this.props.meeting)}
                tabIndex='0'
                role='link'
                selected={this.props.selected}
            >
                {loadingDisplay}
                <div className='room-name'>{this.props.roomName}</div>
                <div className='meeting-time'>{meetingTime}</div>
            </div>
        );
    }

    /* **************************************************************************
     * _formatMeetingTime (private static)                                 */ /**
     *
     * Format the date and time of a meeting for this MeetingListElement
     *
     * @param {Date} dt
     *
     * @returns {string} a formatted representation of the given date
     */
    static _formatMeetingTime(dt) {
        const format = d3.timeFormat('%m/%d/%y; %I:%M %p');
        return format(new Date(dt));
    }
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    MeetingListElement,
};
