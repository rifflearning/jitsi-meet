/* eslint-disable require-jsdoc */

import {
    Button
} from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import PropTypes from 'prop-types';
import React from 'react';

import GoogleCalendarIcon from '../../../../../images/googleCalendar.svg';
import { connect } from '../../../base/redux';
import { signIn } from '../../../calendar-sync';

import createCalendarEntry from './googleCalendar';


function AddToGoogleCalendarButton({ meeting, multipleRoom, attemptSignInToGoogleApi }) {

    const roomId = meeting.multipleRoomsQuantity
        ? `${meeting.roomId}-${multipleRoom}`
        : meeting.roomId;
    const meetingUrl = `${window.location.origin}/${roomId}`;

    const event = {
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

        // 'recurrence': [
        //     'RRULE:FREQ=DAILY;COUNT=2'
        // ],
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
