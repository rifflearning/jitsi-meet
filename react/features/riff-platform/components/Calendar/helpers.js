import moment from 'moment';

import { CALENDARS } from '../../constants/calendarSync';

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

const msDaysOfWeekMap = {
    'Sun': 'Sunday',
    'Mon': 'Monday',
    'Tue': 'Tuesday',
    'Wed': 'Wednesday',
    'Thu': 'Thursday ',
    'Fri': 'Friday',
    'Sat': 'Saturday'
};

const getGoogleCalendarRecurrenceRule = (options = {}) => {
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

const getMsCalendarRecurrenceRule = (meetingDateStart, options = {}) => {
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
            ? { 'daysOfWeek': options.daysOfWeek.map(day => msDaysOfWeekMap[day]) }
            : {};

    const monthlyRule = options.recurrenceType === 'monthly'
        ? options.monthlyByDay
            ? {
                'type': 'absoluteMonthly',
                'dayOfMonth': options.monthlyByDay
            }
            : {
                'type': 'relativeMonthly',
                'daysOfWeek': [ msDaysOfWeekMap[options.monthlyByWeekDay] ],
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


const getGoogleCalendarEvent = ({ eventInfo, recurrenceOptions }) => {
    return {
        'id': eventInfo.eventId,
        'summary': eventInfo.name,
        'location': eventInfo.meetingUrl,
        'description': eventInfo.description,
        'url': eventInfo.eventId,
        'start': {
            'dateTime': eventInfo.dateStart,
            'timeZone': eventInfo.timezone
        },
        'end': {
            'dateTime': eventInfo.dateEnd,
            'timeZone': eventInfo.timezone
        },

        'recurrence': [
            recurrenceOptions
        ]
    };

};

const getMsCalendarEvent = ({ eventInfo, recurrenceOptions }) => {
    return {
        ...{
            'transactionId': eventInfo.eventId,
            'subject': eventInfo.name,
            body: {
                contentType: 'HTML',
                content: eventInfo.description
            },
            location: {
                displayName: eventInfo.meetingUrl
            },
            'start': {
                'dateTime': eventInfo.dateStart,
                'timeZone': eventInfo.timezone || 'UTC'
            },
            'end': {
                'dateTime': eventInfo.dateEnd,
                'timeZone': eventInfo.timezone || 'UTC'
            },
            'singleValueExtendedProperties': [
                {
                    'id': 'String {66f5a359-4659-4830-9070-00040ec6ac6e} Name id',
                    'value': eventInfo.eventId
                }
            ]
        },
        ...recurrenceOptions ? recurrenceOptions : {}
    };

};

export const getCalendarEvent = ({ meeting, multipleRoom, calendar }) => {
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

    const eventInfo = {
        ...meeting,
        ...{
            eventId,
            dateStart: meeting.dateStart || dateNow,
            description: meeting.description || `Click the following link to join the meeting: ${meetingUrl}`,
            dateEnd: meeting.dateEnd || endDateFromNow,
            meetingUrl
        }
    };

    const googleEvent = getGoogleCalendarEvent({
        eventInfo,
        recurrenceOptions: recurrenceOptions && getGoogleCalendarRecurrenceRule(recurrenceOptions)
    });

    const msEvent = getMsCalendarEvent({
        eventInfo,
        recurrenceOptions: recurrenceOptions && getMsCalendarRecurrenceRule(meeting.dateStart, recurrenceOptions)
    });

    return calendar === CALENDARS.GOOGLE ? googleEvent : msEvent;
};
