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

function splitDate(date) {
    const darray = new Array(); // 0-year,1-month,2-day

    if (date.substr(2, 1) === '/') {
        darray[1] = date.substr(0, 2);
        darray[2] = date.substr(3, 2);
        darray[0] = date.substr(6, 4);
    } else if (date.substr(2, 1) === '.') {
        darray[2] = date.substr(0, 2);
        darray[1] = date.substr(3, 2);
        darray[0] = date.substr(6, 4);
    } else {
        darray[0] = date.substr(0, 4);
        darray[1] = date.substr(5, 2);
        darray[2] = date.substr(8, 2);
    }


    // alert(darray[0] + "-" + darray[1] + "-" + darray[2]);
    return darray;
}

function AddToGoogleCalendarButton({ meeting, multipleRoom, attemptSignInToGoogleApi }) {

    const roomId = meeting.multipleRoomsQuantity
        ? `${meeting.roomId}-${multipleRoom}`
        : meeting.roomId;
    const meetingUrl = `${window.location.origin}/${roomId}`;

    const recurrenceOptions = meeting?.recurrenceOptions?.options || null;

    const udate = meeting?.dateEnd && splitDate(meeting.dateEnd);
    const untilDate = meeting?.dateEnd && `${`0000${udate[0]}`.slice(-4) + `00${udate[1]}`.slice(-2) + `00${udate[2]}`.slice(-2)}T000000Z`;
    const dailyRec = recurrenceOptions
        ? `FREQ=${reccurenceMap[recurrenceOptions.recurrenceType]};INTERVAL=${recurrenceOptions.dailyInterval};UNTIL=${untilDate}`
        : null;

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
            `RRULE:${dailyRec}`
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
