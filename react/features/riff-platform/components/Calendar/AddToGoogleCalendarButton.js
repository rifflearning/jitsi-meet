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

window.config.enableCalendarIntegration = true;
window.config.googleApiApplicationClientID = '387032831739-h6i4p8ou45j21ke8317dn7888d92ur45.apps.googleusercontent.com';

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
    bootstrapGoogleCalendarIntegration,
    isGoogleCalendarIntegrationEnabled
}) {

    if (!isGoogleCalendarIntegrationEnabled) {
        return null;
    }

    const roomId = meeting.multipleRoomsQuantity
        ? `${meeting.roomId}-${multipleRoom}`
        : meeting.roomId;
    const meetingUrl = `${window.location.origin}/${roomId}`;

    const recurrenceOptions = meeting?.recurrenceOptions?.options || null;

    const event = {
        'id': meeting.roomId,
        'summary': meeting.name,
        'location': meetingUrl,
        'description': meeting.description || `Click the following link to join the meeting: ${meetingUrl}`,
        'url': meeting.roomId,
        'start': {
            'dateTime': meeting.dateStart,
            'timeZone': meeting.timezone
        },
        'end': {
            'dateTime': meeting.dateEnd,
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
    isGoogleCalendarIntegrationEnabled: PropTypes.bool,
    meeting: PropTypes.object,
    multipleRoom: PropTypes.number

};

const mapStateToProps = state => {
    return {
        isGoogleCalendarIntegrationEnabled: isGoogleCalendarEnabled(state)
    };
};

const mapDispatchToProps = dispatch => {
    return {
        createCalendarEntry: (calendarId, event) => dispatch(insertCalendarEntry('primary', event)),
        bootstrapGoogleCalendarIntegration: () => dispatch(bootstrapCalendarIntegration())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddToGoogleCalendarButton);
