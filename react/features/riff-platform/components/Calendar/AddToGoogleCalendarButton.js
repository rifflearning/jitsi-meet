/* eslint-disable require-jsdoc */

import {
    Button
} from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

import GoogleCalendarIcon from '../../../../../images/googleCalendar.svg';
import { connect } from '../../../base/redux';
import { insertCalendarEntry, bootstrapCalendarIntegration } from '../../actions/calendarSync';
import { isGoogleCalendarEnabled } from '../../calendarSyncFunctions';

const reccurenceTypeMap = {
    'daily': 'DAILY',
    'weekly': 'WEEKLY',
    'monthly': 'MONTHLY'
};

const daysOfWeekMap = {
    'Sun': 'SU',
    'Mon': 'MO',
    'Tue': 'TU',
    'Wed': 'WE',
    'Thu': 'TH',
    'Fri': 'FR',
    'Sat': 'SA'
};

const dayPositionMap = {
    'First': 1,
    'Second': 2,
    'Third': 3,
    'Fourth': 4
};

const getRecurrenceRule = (options = {}) => {
    const dailyIntervalRule = `${
        options.recurrenceType === 'daily' ? `INTERVAL=${options.dailyInterval};` : ''
    }`;

    // specified in RFC5545 https://datatracker.ietf.org/doc/html/rfc5545#section-3.8.5
    const untilDate = `${moment(options.dateEnd).format('YYYYMMDDTHHmmss')}Z`;

    const endDateRule = `${
        options.dateEnd
            ? `UNTIL=${untilDate};`
            : ''
    }`;

    const occurrenceRule = options.timesEnd ? `COUNT=${options.timesEnd};` : '';

    // eslint-disable-next-line no-confusing-arrow
    const formatedDaysOfWeekString = daysOfWeek => daysOfWeek.reduce((acc, val, i) => i === 0
        ? daysOfWeekMap[val]
        : `${acc},${daysOfWeekMap[val]}`,
        '');

    const weeklyRule = `${
        options.recurrenceType === 'weekly'
            ? options.daysOfWeek.length > 0
                ? `BYDAY=${formatedDaysOfWeekString(options.daysOfWeek)};`
                : ''
            : ''
    }`;

    const monthlyRule = `${options.recurrenceType === 'monthly'
        ? options.monthlyByDay
            ? `INTERVAL=1;BYMONTHDAY=${options.monthlyByDay};`
            : `INTERVAL=1;BYDAY=${dayPositionMap[options.monthlyByPosition]}${daysOfWeekMap[options.monthlyByWeekDay]};`
        : ''
    }`;

    // eslint-disable-next-line max-len
    return `RRULE:FREQ=${reccurenceTypeMap[options.recurrenceType]};${dailyIntervalRule}${weeklyRule}${monthlyRule}${endDateRule}${occurrenceRule}`;
};

function AddToGoogleCalendarButton({
    meeting,
    multipleRoom,
    createCalendarEntry,
    bootstrapGoogleCalendarIntegration
}) {

    const isGoogleCalendarIntegrationEnabled = isGoogleCalendarEnabled();

    if (!isGoogleCalendarIntegrationEnabled) {
        return null;
    }

    const roomId = meeting.multipleRoomsQuantity
        ? `${meeting.roomId}-${multipleRoom}`
        : meeting.roomId;
    const meetingUrl = `${window.location.origin}/${roomId}`;

    const recurrenceOptions = meeting?.recurrenceOptions?.options || null;

    const dateNow = moment().toISOString();
    const endDateFromNow = moment()
        .add(1, 'hours')
        .toISOString();

    const eventId = meeting.multipleRoomsQuantity
        ? `${meeting.roomId}${multipleRoom}`
        : meeting.roomId;

    const event = {
        'id': eventId,
        'summary': meeting.name,
        'location': meetingUrl,
        'description': meeting.description || `Click the following link to join the meeting: ${meetingUrl}`,
        'url': eventId,
        'start': {
            'dateTime': meeting.dateStart || dateNow,
            'timeZone': meeting.timezone
        },
        'end': {
            'dateTime': meeting.dateEnd || endDateFromNow,
            'timeZone': meeting.timezone
        },

        'recurrence': [
            recurrenceOptions && getRecurrenceRule(recurrenceOptions)
        ]
    };

    useEffect(() => {
        bootstrapGoogleCalendarIntegration();
    }, []);

    const onAddToCalendar = () => {
        createCalendarEntry('primary', event);
    };

    return (
        <Button
            color = 'default'
            // eslint-disable-next-line react/jsx-no-bind
            onClick = { onAddToCalendar }
            startIcon = { <Icon><GoogleCalendarIcon /></Icon> }
            variant = 'outlined'> Google Calendar</Button>
    );
}

AddToGoogleCalendarButton.propTypes = {
    bootstrapGoogleCalendarIntegration: PropTypes.func,
    createCalendarEntry: PropTypes.func,
    meeting: PropTypes.object,
    multipleRoom: PropTypes.number

};

const mapStateToProps = () => {
    return { };
};

const mapDispatchToProps = dispatch => {
    return {
        createCalendarEntry: (calendarId, event) => dispatch(insertCalendarEntry(calendarId, event)),
        bootstrapGoogleCalendarIntegration: () => dispatch(bootstrapCalendarIntegration())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddToGoogleCalendarButton);
