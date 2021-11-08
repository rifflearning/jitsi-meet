/* ******************************************************************************
 * agendaTimer.js                                                               *
 * *************************************************************************/ /**
 *
 * @fileoverview React component to visualize the agenda timer in the meeting.
 *
 * Created on       November 22, 2021
 * @author          Oliver Millard
 *
 * @copyright (c) 2021-present Riff Analytics,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/
/* eslint-disable no-negated-condition */
/* eslint-disable valid-jsdoc */
/* eslint-disable require-jsdoc */

import PropTypes from 'prop-types';
import React from 'react';

import { connect } from '../../../base/redux';

/* ******************************************************************************
 * AgendaTimer                                                             */ /**
 *
 * React component to visualize the agenda timer for the meeting. Uses the current
 * time and the start time to determine which agenda item to show.
 *
 ********************************************************************************/
class AgendaTimer extends React.Component {
    /** The handler for the setInterval timer used to update the timer*/
    intervalHandle = null;

    static propTypes = {
        agenda: PropTypes.array,
        startTime: PropTypes.Date
    }

    /* **************************************************************************
     * constructor                                                         */ /**
     */
    constructor(props) {
        super(props);
        this.state = {
            useEventStyle: false,
            noEventsLeft: false,
            showAgenda: false,
            displayTime: '',
            displayName: ''
        };
    }

    /* **************************************************************************
     * componentDidUpdate                                                  */ /**
     *
     * Format the agenda array to have the end times of the entries once they
     * are loaded.
     *
     */
    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            if (this.props.agenda.length > 0 && this.props.startTime) {
                this.createAgendaWithEndTimes();
            }
        }
    }

    /* **************************************************************************
     * componentWillUnmount                                                */ /**
     *
     * Removes the timer's setInterval if a participant leaves before the agenda
     * has finished.
     *
     */
    componentWillUnmount() {
        this.cancelIntervalTimer();
    }


    /* **************************************************************************
     * render                                                              */ /**
     *
     * Required method of a React component.
     *
     * @see {@link https://reactjs.org/docs/react-component.html#render|React.Component.render}
     */
    render() {
        if (this.props.startTime === null) {
            return null;
        }

        const currClass = this.state.useEventStyle ? 'agenda-timer-event' : 'agenda-timer';

        return (
            <div>
                {this.state.showAgenda
                    && <div className = { 'agenda-timer-wrapper' }>
                        <div className = { currClass }>
                            {this.state.noEventsLeft
                                ? (<div className = { 'agenda-timer-label' }>
                                    {'No more agenda items'}
                                </div>)
                                : (<div className = { 'agenda-timer-text-container' }>
                                    <div className = { 'agenda-timer-label' }>
                                        {`${this.state.displayName}`}
                                    </div>
                                    <div className = { 'agenda-timer-time' }>
                                        {`${this.state.displayTime}`}
                                    </div>
                                </div>)}
                        </div>
                    </div>
                }
            </div>
        );
    }

    /* **************************************************************************
     * createAgendaWithEndTimes                                            */ /**
     *
     * Iterates through the agenda array from props and creates new array with
     * the end time of the agenda items relative to the start time of the meeting.
     * Passes the new agenda array into startTimer().
     *
     */
    createAgendaWithEndTimes() {
        const agendaWithEndTimes = [];
        let totDuration = 0;

        for (let i = 0; i < this.props.agenda.length; i++) {
            totDuration += this.props.agenda[i].duration;
            const endTime = new Date(this.props.startTime.getTime() + (totDuration * 60000));

            const agendaItem = {
                ...this.props.agenda[i],
                endTime
            };

            agendaWithEndTimes.push(agendaItem);
        }

        this.startTimer(agendaWithEndTimes);
    }

    /* ******************************************************************************
     * startTimer                                                              */ /**
     *
     * Starts the agenda timer. Finds the current agenda item based on the current
     * time and iterates through until there are no more agenda items left.
     *
     * @param {array} agendaWithEndTimes - The agenda with the correct end times added
     * as a property from createAgendaWithEndTimes().
     */
    startTimer(agendaWithEndTimes) {
        // Show the agenda timer
        this.setState({ showAgenda: true });

        // Perform action every 1 second
        this.intervalHandle = setInterval(() => {
            const currTime = new Date();
            let timeDiff = 0;

            // Find the agenda item with an end time later than the current time
            const currAgendaItem = agendaWithEndTimes.find(entry => currTime < entry.endTime);

            // If there are still agenda items left within the time frame, update the timer
            if (currAgendaItem !== undefined) {
                // Round the time to prevent ms
                timeDiff = Math.floor((currAgendaItem.endTime.getTime() - currTime.getTime()) / 1000);

                // Use transition style after duration (currently 3 sec)
                if (timeDiff <= 3) {
                    this.setState({ useEventStyle: true });
                } else if (this.state.useEventStyle === true) {
                    this.setState({ useEventStyle: false });
                }

                // Create the time string
                const minutes = Math.floor(timeDiff / 60);
                const seconds = timeDiff - (minutes * 60);
                const timeString = seconds < 10 ? `${minutes}:0${seconds}` : `${minutes}:${seconds}`;

                // Update the state for the display name and time
                this.setState({
                    displayTime: timeString,
                    displayName: currAgendaItem.eventName
                });

            } else {
                // If there are no more agenda items left, update state
                this.setState({
                    noEventsLeft: true,
                    useEventStyle: true
                });

                // Remove the setInterval for the timer
                this.cancelIntervalTimer();
            }
        }, 1000);
    }

    /* **************************************************************************
     * cancelIntervalTimer                                                 */ /**
     *
     * Removes the timer's setInterval. Called when the participant leaves or if
     * there are no more agenda items left.
     *
     */
    cancelIntervalTimer() {
        console.log('OLIVER in cancelIntervalTimer');
        if (this.intervalHandle !== null) {
            clearInterval(this.intervalHandle);
            this.intervalHandle = null;
        }
    }

    /* ******************************************************************************
     * hideAgenda                                                              */ /**
     *
     * Hide the agenda timer after a 3sec delay.
     * NOTE: Currently unused, but left in bc we may want to reimplement this feature.
     */
    hideAgenda() {
        let hideAgendaHandler = setInterval(() => {
            this.setState({ showAgenda: false });
            clearInterval(hideAgendaHandler);
            hideAgendaHandler = null;
        }, 3000);
    }
}

const mapStateToProps = state => {
    return {
        agenda: state['features/riff-platform'].meeting.meeting.agenda,
        startTime: state['features/riff-platform'].riff.activeMeeting?.startTime
    };
};

const ConnectedAgendaTimer = connect(mapStateToProps)(AgendaTimer);

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    ConnectedAgendaTimer as AgendaTimer
};
