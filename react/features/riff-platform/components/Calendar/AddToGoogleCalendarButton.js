/* eslint-disable require-jsdoc */

import {
    Button
} from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

import GoogleCalendarIcon from '../../../../../images/googleCalendar.svg';
import { connect } from '../../../base/redux';
import { signIn } from '../../../calendar-sync';

import createCalendarEntry from './googleCalendar';

const reccurenceMap = {
    'daily': 'DAILY',
    'weekly': 'WEEKLY',
    'monthly': 'MONTHLY',
    'daysOfWeek': 'BYDAY'
};

const getRecurrenceRule = (options = {}) => {
    const intervalPart = `${
        options.recurrenceType === 'daily' ? `INTERVAL=${options.dailyInterval};` : ''
    }`;

    // specified in RFC5545 https://datatracker.ietf.org/doc/html/rfc5545#section-3.8.5
    const untilDate = `${moment(options.dateEnd).format('YYYYMMDDTHHmmss')}Z`;

    const endDatePart = `${
        options.dateEnd
            ? `UNTIL=${untilDate};`
            : ''
    }`;

    return `RRULE:FREQ=${reccurenceMap[options.recurrenceType]};${intervalPart}${endDatePart}`;
};

function AddToGoogleCalendarButton({ meeting, multipleRoom, attemptSignInToGoogleApi }) {

    const roomId = meeting.multipleRoomsQuantity
        ? `${meeting.roomId}-${multipleRoom}`
        : meeting.roomId;
    const meetingUrl = `${window.location.origin}/${roomId}`;

    const recurrenceOptions = meeting?.recurrenceOptions?.options || null;
    
    const event = {
        // 'id': meeting._id,
        'summary': meeting.name,
        'location': meetingUrl,
        'description': `Click the following link to join the meeting: ${meetingUrl}`,
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
        ],
        'attendees': [

            // { 'email': 'lpage@example.com' },
            // { 'email': 'sbrin@example.com' }
        ]

        // 'reminders': {
        //     'useDefault': false,
        //     'overrides': [
        //         { 'method': 'email',
        //             'minutes': 24 * 60 },
        //         { 'method': 'popup',
        //             'minutes': 10 }
        //     ]
        // }
    };

    console.log('event', event);

    const onAddToCalendar = () => {
        createCalendarEntry('primary', event).then(res => {
            if (!res) {
                // refactor it
                return attemptSignInToGoogleApi().then(() => createCalendarEntry('primary', event));
            }

            return res;
        });
    };

    return (
        <Button
            color = 'primary'
            // eslint-disable-next-line react/jsx-no-bind
            onClick = { onAddToCalendar }
            startIcon = { <Icon><GoogleCalendarIcon /></Icon> }
            variant = 'contained'>   Add to google calendar</Button>
    );
}

AddToGoogleCalendarButton.propTypes = {
    attemptSignInToGoogleApi: PropTypes.func,
    meeting: PropTypes.object,
    multipleRoom: PropTypes.number
};


const mapStateToProps = () => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {
        attemptSignInToGoogleApi: () => dispatch(signIn('google'))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddToGoogleCalendarButton);
