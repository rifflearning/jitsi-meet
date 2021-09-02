/* eslint-disable require-jsdoc */

import { Button } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

import OutlookCalendarIcon from '../../../../../images/outlookIcon.svg';
import { connect } from '../../../base/redux';
import { bootstrapMsCalendarIntegration, createMsCalendarEntry } from '../../actions/calendarSync';
import { isMsCalendarEnabled } from '../../calendarSyncFunctions';

window.config.microsoftApiApplicationClientID = 'bc85555d-6216-4981-aa9f-ee1da895f660';

const daysOfWeekMap = {
    'Sun': 'Sunday',
    'Mon': 'Monday',
    'Tue': 'Tuesday',
    'Wed': 'Wednesday',
    'Thu': 'Thursday ',
    'Fri': 'Friday',
    'Sat': 'Saturday'
};

const getRecurrenceRule = (meetingDateStart, options = {}) => {
    const endDateRange = options.dateEnd
        ? {
            'type': 'endDate',
            'startDate': `${moment(meetingDateStart).format('YYYY-MM-DD')}`,
            'endDate': `${moment(options.dateEnd).format('YYYY-MM-DD')}`
        } : {};

    const occurrenceRule = options.timesEnd ? {
        'type': 'numbered',
        'startDate': `${moment(meetingDateStart).format('YYYY-MM-DD')}`,
        'numberOfOccurrences': options.timesEnd
    } : {};

    const weeklyRule
        = options.recurrenceType === 'weekly' && options.daysOfWeek.length > 0
            ? { 'daysOfWeek': options.daysOfWeek.map(day => daysOfWeekMap[day]) }
            : {};

    const monthlyRule = options.recurrenceType === 'monthly'
        ? options.monthlyByDay
            ? {
                'type': 'absoluteMonthly',
                'dayOfMonth': options.monthlyByDay
            }
            : {
                'type': 'relativeMonthly',
                'daysOfWeek': [ daysOfWeekMap[options.monthlyByWeekDay] ],
                'index': options.monthlyByPosition
            } : {};

    const mainPattern = {
        'type': options.recurrenceType,
        'interval': options.dailyInterval || 1
    };
    const reccurInfo = {
        'recurrence': {
            'pattern': {
                ...mainPattern,
                ...weeklyRule,
                ...monthlyRule
            },
            'range': {
                ...endDateRange,
                ...occurrenceRule
            }
        }
    };

    return reccurInfo;
};

function AddToGoogleCalendarButton({
    meeting,
    multipleRoom,
    isMsCalendarIntegartionEnabled,
    createCalendarEntry,
    bootstrapCalendarIntegration
}) {

    if (!isMsCalendarIntegartionEnabled) {
        return null;
    }

    const roomId = meeting.multipleRoomsQuantity
        ? `${meeting.roomId}-${multipleRoom}`
        : meeting.roomId;
    const meetingUrl = `${window.location.origin}/${roomId}`;

    const recurrenceOptions = meeting?.recurrenceOptions?.options || null;

    const reccurenceRule = recurrenceOptions ? getRecurrenceRule(meeting.dateStart, recurrenceOptions) : {};

    const event = {
        'transactionId': meeting.roomId,
        'subject': meeting.name,
        body: {
            contentType: 'HTML',
            content: meeting.description || `Click the following link to join the meeting: ${meetingUrl}`
        },
        location: {
            displayName: meetingUrl
        },
        'start': {
            'dateTime': meeting.dateStart,
            'timeZone': meeting.timezone
        },
        'end': {
            'dateTime': meeting.dateEnd,
            'timeZone': meeting.timezone
        }
    };

    useEffect(() => {
        bootstrapCalendarIntegration();
    },
        []);

    const onAddToCalendar = () => createCalendarEntry('1', {
        ...event,
        ...reccurenceRule
    });

    return (
        <Button
            color = 'default'
            // eslint-disable-next-line react/jsx-no-bind
            onClick = { onAddToCalendar }
            startIcon = { <Icon><OutlookCalendarIcon /></Icon> }
            variant = 'outlined' >Outlook Calendar</Button>
    );
}

AddToGoogleCalendarButton.propTypes = {
    bootstrapCalendarIntegration: PropTypes.func,
    createCalendarEntry: PropTypes.func,
    isMsCalendarIntegartionEnabled: PropTypes.bool,
    meeting: PropTypes.object,
    multipleRoom: PropTypes.number
};

const mapStateToProps = state => {

    return {
        isMsCalendarIntegartionEnabled: isMsCalendarEnabled(state)
    };
};

const mapDispatchToProps = dispatch => {
    return {
        createCalendarEntry: (calendarId, event) => dispatch(createMsCalendarEntry(calendarId, event)),
        bootstrapCalendarIntegration: () => dispatch(bootstrapMsCalendarIntegration())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddToGoogleCalendarButton);
