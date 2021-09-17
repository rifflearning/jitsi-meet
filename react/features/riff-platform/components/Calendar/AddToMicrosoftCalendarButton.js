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

function AddToMsCalendarButton({
    meeting,
    multipleRoom,
    createCalendarEntry,
    bootstrapCalendarIntegration
}) {

    const isMsCalendarIntegartionEnabled = isMsCalendarEnabled();

    if (!isMsCalendarIntegartionEnabled) {
        return null;
    }

    const roomId = meeting.multipleRoomsQuantity
        ? `${meeting.roomId}-${multipleRoom}`
        : meeting.roomId;
    const meetingUrl = `${window.location.origin}/${roomId}`;

    const recurrenceOptions = meeting?.recurrenceOptions?.options || null;

    const reccurenceRule = recurrenceOptions ? getRecurrenceRule(meeting.dateStart, recurrenceOptions) : {};

    const dateNow = moment().toISOString();
    const endDateFromNow = moment()
        .add(1, 'hours')
        .toISOString();

    const eventId = meeting.multipleRoomsQuantity
        ? `${meeting.roomId}${multipleRoom}`
        : meeting.roomId;

    const event = {
        'transactionId': eventId,
        'subject': meeting.name,
        body: {
            contentType: 'HTML',
            content: meeting.description || `Click the following link to join the meeting: ${meetingUrl}`
        },
        location: {
            displayName: meetingUrl
        },
        'start': {
            'dateTime': meeting.dateStart || dateNow,
            'timeZone': meeting.timezone || 'UTC'
        },
        'end': {
            'dateTime': meeting.dateEnd || endDateFromNow,
            'timeZone': meeting.timezone || 'UTC'
        },
        'singleValueExtendedProperties': [
            {
                'id': 'String {66f5a359-4659-4830-9070-00040ec6ac6e} Name id',
                'value': eventId
            }
        ]
    };

    useEffect(() => {
        bootstrapCalendarIntegration();
    }, []);

    const onAddToCalendar = () => createCalendarEntry({
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

AddToMsCalendarButton.propTypes = {
    bootstrapCalendarIntegration: PropTypes.func,
    createCalendarEntry: PropTypes.func,
    meeting: PropTypes.object,
    multipleRoom: PropTypes.number
};

const mapStateToProps = () => {

    return { };
};

const mapDispatchToProps = dispatch => {
    return {
        createCalendarEntry: event => dispatch(createMsCalendarEntry(event)),
        bootstrapCalendarIntegration: () => dispatch(bootstrapMsCalendarIntegration())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddToMsCalendarButton);
