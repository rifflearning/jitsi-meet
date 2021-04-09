/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-sort-props */
/* eslint-disable react/no-multi-comp */

import MomentUtils from '@date-io/moment';
import {
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    MenuItem,
    TextField,
    Typography,
    Radio,
    Switch
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Autocomplete } from '@material-ui/lab';
import Alert from '@material-ui/lab/Alert';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker
} from '@material-ui/pickers';
import moment from 'moment';
import momentTZ from 'moment-timezone';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import 'moment-recur';
import { useHistory } from 'react-router';

import { connect } from '../../../base/redux';
import { schedule,
    updateSchedule,
    updateScheduleRecurring,
    updateScheduleRecurringSingleOccurrence
} from '../../actions/scheduler';
import { logout } from '../../actions/signIn';
import { getNumberRangeArray } from '../../functions';

import {
    getRecurringDailyEventsByOccurance,
    getRecurringDailyEventsByEndDate,
    getRecurringWeeklyEventsByOccurance,
    getRecurringWeeklyEventsByEndDate,
    getRecurringMonthlyEventsByOccurance,
    getRecurringMonthlyEventsByEndDate,
    daysOfWeekMap,
    getDateByTimeAndTimezone
} from './helpers';

moment.locale('en');

const useStyles = makeStyles(theme => {
    return {
        paper: {
            marginTop: theme.spacing(4),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        },
        avatar: {
            margin: theme.spacing(1),
            backgroundColor: theme.palette.secondary.main
        },
        form: {
            width: '99%', // Fix IE 11 issue. and bottom scroll issue
            marginTop: theme.spacing(1)
        },
        submit: {
            margin: theme.spacing(3, 0, 2)
        },
        formAlert: {
            border: 'none'
        },
        timezoneList: {
            maxWidth: '260px'
        },
        datePickerInput: {
            '&:read-only': {
                color: '#ffffff'
            }
        }
    };
});

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: 300
        }
    }
};

const hoursArray = getNumberRangeArray(0, 9);
const minutesArray = getNumberRangeArray(0, 45, 15);
const multipleMeetingArray = getNumberRangeArray(2, 99);
const recurrenceIntervalArray = getNumberRangeArray(1, 20);
const recurrenceTypeArray = [ 'daily', 'weekly', 'monthly' ];
const daysOfWeekArray = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ];
const monthlyByPositionArray = [ 'First', 'Second', 'Third', 'Fourth' ];

const monthlyByPositionMap = {
    'First': 0,
    'Second': 1,
    'Third': 2,
    'Fourth': 3
};

const repeatIntervalMap = {
    daily: {
        name: 'day(s)',
        label: 'Day',
        interval: getNumberRangeArray(1, 15)
    },
    weekly: {
        name: 'week',
        label: 'Week',
        interval: getNumberRangeArray(1, 12)
    },
    monthly: {
        name: 'month',
        label: 'Month',
        interval: getNumberRangeArray(1, 31)
    }
};

const recurrenceTypeMap = {
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly'
};

const defaultOccurrences = 7;

const calculateRecurringByEndDate = ({
    startDate,
    endDate,
    daysInterval,
    occurrences,
    recurrenceType,
    daysOfWeek,
    monthlyBy,
    dayOfMonth,
    monthlyByWeekDay,
    monthlyByPosition
}) => {
    let recurringEvents = [];
    const checkDate = endDate && endDate.isAfter(startDate);

    if (recurrenceType === 'daily') {
        recurringEvents = getRecurringDailyEventsByEndDate({
            startDate,
            endDate: checkDate ? endDate : null,
            daysInterval,
            daysOccurances: occurrences
        });
    } else if (recurrenceType === 'weekly') {
        recurringEvents = getRecurringWeeklyEventsByEndDate({
            startDate,
            endDate: checkDate ? endDate : null,
            weeksOccurances: occurrences,
            daysOfWeek
        });
    } else if (recurrenceType === 'monthly') {
        recurringEvents = getRecurringMonthlyEventsByEndDate({
            startDate,
            endDate: checkDate ? endDate : null,
            monthOccurances: occurrences,
            monthlyBy,
            dayOfMonth,
            monthlyByWeekDay,
            monthlyByPosition
        });
    }

    return recurringEvents;
};
const calculateRecurringByOccurrence = ({
    startDate,
    daysInterval,
    occurrences,
    recurrenceType,
    daysOfWeek,
    monthlyBy,
    dayOfMonth,
    monthlyByWeekDay,
    monthlyByPosition
}) => {
    let recurringEvents = [];

    if (recurrenceType === 'daily') {
        recurringEvents = getRecurringDailyEventsByOccurance({
            startDate,
            daysOccurances: occurrences,
            daysInterval
        });
    } else if (recurrenceType === 'weekly') {
        recurringEvents = getRecurringWeeklyEventsByOccurance({
            startDate,
            weeksOccurances: occurrences,
            daysOfWeek
        });
    } else if (recurrenceType === 'monthly') {
        recurringEvents = getRecurringMonthlyEventsByOccurance({
            startDate,
            monthOccurances: occurrences,
            monthlyBy,
            dayOfMonth,
            monthlyByWeekDay,
            monthlyByPosition
        });
    }

    return recurringEvents;
};

const getDaysOfWeekArr = daysOfWeek => Object.keys(daysOfWeek).reduce((acc, v) => {
    daysOfWeek[v] && acc.push(v);

    return acc;
}, []);

const getDaysOfWeekObj = ({ daysOfWeekArr, selectedDaysOfWeekArr }) => daysOfWeekArr.reduce((acc, v) => {
    acc[v] = selectedDaysOfWeekArr.includes(v);

    return acc;
}, {});

// Returns start/end dates for recurring meetings with correct time by timezone in the ISO format.
const getRecurringDatesWithTime = ({ dates, startDate, duration, timezone }) => {

    const hStart = startDate.hours();
    const mStart = startDate.minutes();

    return dates.map(date => {
        const newDateStart = getDateByTimeAndTimezone(date, timezone).set('hour', hStart)
        .set('minute', mStart);
        const newDateEnd = newDateStart.clone().add(duration.hours, 'hours')
        .add(duration.minutes, 'minutes');

        return {
            startDate: newDateStart.toISOString(),
            endDate: newDateEnd.toISOString()
        };
    });
};

const getMeetingDuration = ({ dateStart, dateEnd }) => {

    const meetingDuration = moment
    .duration(moment(dateEnd)
    .diff(moment(dateStart)));

    const durationMinutes = meetingDuration.asMinutes();

    const hours = durationMinutes / 60;
    const durationH = Math.floor(hours);
    const minutes = (hours - durationH) * 60;
    const durationM = Math.round(minutes);

    return { durationH,
        durationM };
};

// Sets date correct time by timezone, returns date in the ISO format.
const setCorrectTimeToDate = (correctD, d, timezone) => {
    const h = correctD.hours();
    const m = correctD.minutes();

    return getDateByTimeAndTimezone(d, timezone).set('hour', h)
        .set('minute', m)
        .toISOString();
};

const SchedulerForm = ({
    userId,
    loading,
    error,
    scheduleMeeting,
    isEditing,
    meeting,
    updateScheduleMeetingsRecurring,
    updateScheduleMeeting,
    updateScheduleMeetingRecurringSingleOccurrence,
    updateError,
    updateLoading,
    isAnon,
    doLogout
}) => {
    const classes = useStyles();
    const localUserTimezone = momentTZ.tz.guess();
    const [ timezone, setTimezone ] = useState(localUserTimezone);

    const [ name, setname ] = useState('');
    const [ description, setdescription ] = useState('');
    const [ date, setdate ] = useState(getDateByTimeAndTimezone(moment(), timezone));
    const [ hours, setHours ] = useState(1);
    const [ minutes, setMinutes ] = useState(0);
    const [ allowAnonymous, setAllowAnonymous ] = useState(false);
    const [ recurringMeeting, setRecurringMeeting ] = useState(false);
    const [ recurrenceType, setRecurrenceType ] = useState('daily');
    const [ recurrenceInterval, setRecurrenceInterval ] = useState(1);
    const [ endDateBy, setEndDateBy ] = useState('endDateTime');
    const [ endDate, setEndDate ] = useState(getDateByTimeAndTimezone(moment(), timezone));
    const [ endTimes, setEndTimes ] = useState(7);
    const [ monthlyBy, setMonthlyBy ] = useState('monthlyByDay');
    const [ monthlyByPosition, setMonthlyByPosition ] = useState('First');
    const [ monthlyByWeekDay, setMonthlyByWeekDay ] = useState('Mon');
    const [ monthlyByDay, setMonthlyByDay ] = useState(Number(date.format('D')));
    const [ daysOfWeek, setDaysOfWeek ] = useState({
        Sun: false,
        Mon: false,
        Tue: false,
        Wed: false,
        Thu: false,
        Fri: false,
        Sat: false,
        [date.format('ddd')]: true
    });
    const [ occurrenceCount, setOccuranceCount ] = useState(defaultOccurrences);
    const [ recurrenceDate, setRecurrenceDate ] = useState([]);
    const [ waitForHost, setWaitForHost ] = useState(false);
    const [ forbidNewParticipantsAfterDateEnd, setForbidNewParticipantsAfterDateEnd ] = useState(false);

    const [ nameError, setnameError ] = useState('');
    const [ durationError, setDurationError ] = useState('');

    const [ isMultipleRooms, setisMultipleRooms ] = useState(false);
    const [ multipleRooms, setmultipleRooms ] = useState(2);

    const [ changesMadeByUserActions, setChangesMadeByUserActions ] = useState(false);

    const history = useHistory();

    const defineEditMode = () => {
        const params = new URLSearchParams(location.search);

        return params.get('mode');
    };

    const isEditAllMeetingsRecurring = defineEditMode() === 'all';
    const isEditOneOccurrence = defineEditMode() === 'one';

    const setDateByTimezone = (d, tz) => setdate(getDateByTimeAndTimezone(d, tz));

    useEffect(() => {
        setDateByTimezone(date, timezone);
    }, [ timezone ]);

    useEffect(() => {
        if (meeting && isEditing) {

            setname(meeting.name);

            const meetingData = isEditAllMeetingsRecurring ? meeting.recurrenceOptions?.defaultOptions : meeting;
            const meetingTimezone = meeting.timezone ? meeting.timezone : localUserTimezone;

            setdescription(meetingData.description);
            setForbidNewParticipantsAfterDateEnd(meetingData.forbidNewParticipantsAfterDateEnd);
            setWaitForHost(meetingData.waitForHost);
            setAllowAnonymous(meetingData.allowAnonymous);

            if (meetingData.multipleRoomsQuantity) {
                setisMultipleRooms(true);
                setmultipleRooms(meetingData.multipleRoomsQuantity);
            }

            const { durationH, durationM } = getMeetingDuration({ dateStart: meetingData.dateStart,
                dateEnd: meetingData.dateEnd });

            setHours(durationH);
            setMinutes(durationM);

            setdate(momentTZ.tz(meetingData.dateStart, meetingTimezone));
            setTimezone(meetingTimezone);

            const meetingRecurrenceOptions = meeting.recurrenceOptions?.options;

            if (meetingRecurrenceOptions?.recurrenceType) {
                setRecurringMeeting(true);
                setRecurrenceType(meetingRecurrenceOptions.recurrenceType);
                if (meetingRecurrenceOptions.dateEnd) {
                    setEndDateBy('endDateTime');
                    setEndDate(momentTZ.tz(meetingRecurrenceOptions.dateEnd, meetingTimezone));
                } else {
                    setEndDateBy('endTimes');
                    setEndTimes(meetingRecurrenceOptions.timesEnd);
                }

                if (meetingRecurrenceOptions.recurrenceType === 'daily') {
                    setRecurrenceInterval(meetingRecurrenceOptions.dailyInterval);
                } else if (meetingRecurrenceOptions.recurrenceType === 'weekly') {
                    setDaysOfWeek(getDaysOfWeekObj({ daysOfWeekArr: daysOfWeekArray,
                        selectedDaysOfWeekArr: meetingRecurrenceOptions.daysOfWeek }));
                } else if (meetingRecurrenceOptions.recurrenceType === 'monthly') {
                    if (meetingRecurrenceOptions.monthlyByDay) {
                        setMonthlyBy('monthlyByDay');
                        setMonthlyByDay(meetingRecurrenceOptions.monthlyByDay);
                    } else if (meetingRecurrenceOptions.monthlyByPosition
                        && meetingRecurrenceOptions.monthlyByWeekDay) {
                        setMonthlyBy('monthlyByWeekDay');
                        setMonthlyByPosition(meetingRecurrenceOptions.monthlyByPosition);
                        setMonthlyByWeekDay(meetingRecurrenceOptions.monthlyByWeekDay);
                    }
                }
            }
        }
    }, [ meeting ]);

    const isnameValid = () => Boolean(name.length);
    const isDurationValid = () => Boolean(hours || minutes);

    const isFormValid = () => {
        let isValid = true;

        setnameError('');
        setDurationError('');

        if (!isnameValid()) {
            isValid = false;
            setnameError('Please, enter name');
        }

        if (!isDurationValid()) {
            isValid = false;
            setDurationError('Please, pick meeting duration');
        }

        return isValid;
    };

    const selectedNumberDaysOfWeek = getDaysOfWeekArr(daysOfWeek).map(
        day => daysOfWeekMap[day]
    );

    const handleSubmit = e => {
        e.preventDefault();
        if (!isFormValid()) {
            return;
        }

        const meetingStartDate = date.toISOString();

        const dateEnd = date
            .clone()
            .add(hours, 'hours')
            .add(minutes, 'minutes')
            .toISOString();

        const recurrenceValues = recurringMeeting
            ? getRecurringDatesWithTime({ dates: recurrenceDate,
                startDate: date,
                duration: { hours,
                    minutes },
                timezone })
            : null;

        const getRecurrenceOptions = () => {
            const recurrenceOptions = {
                recurrenceType
            };

            if (endDateBy === 'endDateTime') {
                const endDateCorrectTime = setCorrectTimeToDate(date, endDate, timezone);

                recurrenceOptions.dateEnd = endDateCorrectTime;
            } else {
                recurrenceOptions.timesEnd = endTimes;
            }

            if (recurrenceType === 'daily') {
                recurrenceOptions.dailyInterval = recurrenceInterval;
            } else if (recurrenceType === 'weekly') {
                recurrenceOptions.daysOfWeek = getDaysOfWeekArr(daysOfWeek);
            } else if (recurrenceType === 'monthly') {
                if (monthlyBy === 'monthlyByDay') {
                    recurrenceOptions.monthlyByDay = monthlyByDay;
                } else {
                    recurrenceOptions.monthlyByPosition = monthlyByPosition;
                    recurrenceOptions.monthlyByWeekDay = monthlyByWeekDay;
                }
            }

            return recurrenceOptions;
        };

        const defaultOptions = {
            dateStart: meetingStartDate,
            dateEnd,
            description,
            allowAnonymous,
            waitForHost,
            forbidNewParticipantsAfterDateEnd,
            multipleRoomsQuantity: isMultipleRooms ? multipleRooms : null
        };

        const meetingData = {
            createdBy: userId,
            name,
            description,
            dateStart: meetingStartDate,
            dateEnd,
            allowAnonymous,
            waitForHost,
            recurrenceValues,
            timezone,
            recurrenceOptions: recurringMeeting ? {
                defaultOptions,
                options: getRecurrenceOptions()
            } : null,
            forbidNewParticipantsAfterDateEnd,
            multipleRoomsQuantity: isMultipleRooms ? multipleRooms : null
        };

        if (!isEditing) {
            return scheduleMeeting(meetingData, history);
        } else if (isEditing) {
            if (isEditAllMeetingsRecurring) {
                return updateScheduleMeetingsRecurring(meeting.roomId,
                    { roomId: meeting.roomId,
                        ...meetingData }, history);
            } else if (isEditOneOccurrence) {
                return updateScheduleMeetingRecurringSingleOccurrence(meeting._id, meeting.roomId, {
                    name,
                    description,
                    dateStart: meetingStartDate,
                    dateEnd,
                    allowAnonymous,
                    waitForHost,
                    forbidNewParticipantsAfterDateEnd,
                    roomId: meeting.roomId,
                    multipleRoomsQuantity: isMultipleRooms ? multipleRooms : null
                }, history);
            }

            return updateScheduleMeeting(meeting._id, { roomId: meeting.roomId,
                ...meetingData }, history);

        }
    };

    const recurrenceMaxEndDate = {
        daily: moment(date).add(3, 'months')
.endOf('month'),
        weekly: moment(date).add(1, 'years')
.endOf('year'),
        monthly: moment(date).add(2, 'years')
.endOf('year')
    };

    // Passing true will change the time zone without changing the current time.
    // We need it for correct reccuring dates using moment-recur.
    // moment-recur handles dates only, time information is discarded.
    useEffect(() => {
        if (endDateBy === 'endDateTime') {
            const recurrence = calculateRecurringByEndDate({
                startDate: date.clone().utc(true),
                endDate: endDate.clone().utc(true),
                daysInterval: recurrenceInterval,
                occurrences: defaultOccurrences,
                recurrenceType,
                daysOfWeek: selectedNumberDaysOfWeek,
                monthlyBy,
                dayOfMonth: monthlyByDay,
                monthlyByWeekDay: daysOfWeekMap[monthlyByWeekDay],
                monthlyByPosition: monthlyByPositionMap[monthlyByPosition]
            });

            setOccuranceCount(recurrence.length);
            setRecurrenceDate(recurrence);
        }
    }, [
        endDate,
        daysOfWeek,
        endDateBy,
        monthlyBy,
        monthlyByDay,
        monthlyByWeekDay,
        monthlyByPosition,
        timezone
    ]);

    useEffect(() => {
        const isUpdateEndDate = isEditAllMeetingsRecurring || isEditOneOccurrence
            ? changesMadeByUserActions && !isEditOneOccurrence
            : true;

        if (endDateBy === 'endDateTime' && isUpdateEndDate) {
            const recurrence = calculateRecurringByEndDate({
                startDate: date.clone().utc(true),
                endDate: null,
                daysInterval: recurrenceInterval,
                occurrences: defaultOccurrences,
                recurrenceType,
                daysOfWeek: selectedNumberDaysOfWeek,
                monthlyBy,
                dayOfMonth: monthlyByDay,
                monthlyByWeekDay: daysOfWeekMap[monthlyByWeekDay],
                monthlyByPosition: monthlyByPositionMap[monthlyByPosition]
            });

            setOccuranceCount(recurrence.length);
            setRecurrenceDate(recurrence);
            setEndDate(recurrence[recurrence.length - 1]);
        }
    }, [
        date,
        recurrenceType,
        recurrenceInterval,
        endDateBy,
        timezone
    ]);

    useEffect(() => {
        if (endDateBy !== 'endDateTime') {
            const recurrence = calculateRecurringByOccurrence({
                startDate: date.clone().utc(true),
                daysInterval: recurrenceInterval,
                occurrences: endTimes,
                recurrenceType,
                daysOfWeek: selectedNumberDaysOfWeek,
                monthlyBy,
                dayOfMonth: monthlyByDay,
                monthlyByWeekDay: daysOfWeekMap[monthlyByWeekDay],
                monthlyByPosition: monthlyByPositionMap[monthlyByPosition]
            });

            setRecurrenceDate(recurrence);
        }
    }, [
        recurrenceType,
        recurrenceInterval,
        date,
        endTimes,
        endDateBy,
        daysOfWeek,
        monthlyBy,
        monthlyByDay,
        monthlyByWeekDay,
        monthlyByPosition,
        timezone
    ]);


    const recurrenceDesc = () => {
        const intervalPart = `Every ${
            recurrenceType === 'daily' ? recurrenceInterval : ''
        } ${repeatIntervalMap[recurrenceType].name}`;

        const endDatePart = `${
            endDateBy === 'endDateTime'
                ? `, until ${moment(endDate).format('MMM DD, YYYY')}`
                : ''
        }`;

        const daysOfWeekPart = `${
            recurrenceType === 'weekly'
                ? getDaysOfWeekArr(daysOfWeek).length > 0
                    ? ` on ${getDaysOfWeekArr(daysOfWeek).join(', ')}`
                    : ''
                : ''
        }`;

        const daysOfMonthPart = `${recurrenceType === 'monthly'
            ? monthlyBy === 'monthlyByDay'
                ? ` on the ${monthlyByDay} of the month`
                : ` on the ${monthlyByPosition} ${monthlyByWeekDay}`
            : ''
        }`;

        const occurrencePart = `, ${
            endDateBy === 'endDateTime' ? occurrenceCount : endTimes
        } occurrence(s)`;

        return `${intervalPart}${daysOfWeekPart}${daysOfMonthPart}${endDatePart}${occurrencePart}`;

    };

    const defineStartDateMinValue = () => {
        const meetingDateStart = isEditAllMeetingsRecurring
            ? meeting?.recurrenceOptions?.defaultOptions?.dateStart
            : meeting?.dateStart;

        const isPastDate = moment(meetingDateStart).isBefore(moment());

        return isEditing
            ? isPastDate
                ? meetingDateStart
                : moment()
            : moment();
    };

    const timeZonesList = momentTZ.tz.names();

    return (
        <form
            className = { classes.form }
            noValidate
            autoComplete = 'off'
            onSubmit = { handleSubmit }>
            <Grid
                container
                spacing = { 1 }>
                <Grid
                    item
                    xs = { 12 }
                    sm = { 10 }
                    md = { 8 }>
                    <TextField
                        variant = 'outlined'
                        margin = 'normal'
                        required
                        fullWidth
                        id = 'name'
                        label = 'Meeting name'
                        name = 'name'
                        autoFocus
                        value = { name }
                        onChange = { e => setname(e.target.value) }
                        error = { Boolean(nameError) }
                        helperText = { nameError }

                        // disabled when edit single meeting occurrence
                        disabled = { isEditOneOccurrence } />
                </Grid>
                <Grid
                    item
                    xs = { 12 }
                    sm = { 10 }
                    md = { 8 }>
                    <TextField
                        variant = 'outlined'
                        margin = 'normal'
                        fullWidth
                        id = 'description'
                        label = 'Description (Optional)'
                        name = 'description'
                        value = { description }
                        onChange = { e => setdescription(e.target.value) } />
                </Grid>
            </Grid>

            <Grid
                container
                alignItems = 'center'
                spacing = { 2 }>
                <Grid
                    item
                    xs = { 12 }
                    sm = { 3 }
                    md = { 2 }>
                    <Typography>
                    When
                    </Typography>
                </Grid>

                <Grid
                    item
                    xs = { 12 }
                    sm = { 8 }
                    md = { 10 }>
                    <MuiPickersUtilsProvider utils = { MomentUtils }>
                        <Grid
                            container
                            spacing = { 2 }>
                            <Grid item>
                                <KeyboardDatePicker
                                    autoOk
                                    disableToolbar
                                    variant = 'inline'
                                    format = 'MM/DD/YYYY'
                                    margin = 'normal'
                                    id = 'date-picker-inline'
                                    minDate = { defineStartDateMinValue() }
                                    label = 'Date'
                                    value = { date }
                                    onChange = { d => {
                                        setChangesMadeByUserActions(true);
                                        setDateByTimezone(d, timezone);
                                    } }
                                    InputProps = {{ readOnly: true,
                                        classes: {
                                            input: classes.datePickerInput
                                        }
                                    }}
                                    KeyboardButtonProps = {{
                                        'aria-label': 'change date'
                                    }} />
                            </Grid>
                            <Grid item>
                                <KeyboardTimePicker
                                    autoOk
                                    margin = 'normal'
                                    id = 'time-picker'
                                    label = 'Time'
                                    value = { date }
                                    onChange = { d => setDateByTimezone(d, timezone) }
                                    InputProps = {{ readOnly: true,
                                        classes: {
                                            input: classes.datePickerInput
                                        }
                                    }}
                                    KeyboardButtonProps = {{
                                        'aria-label': 'change time'
                                    }} />
                            </Grid>
                        </Grid>
                    </MuiPickersUtilsProvider>
                </Grid>

                <Grid
                    item
                    xs = { 12 }
                    sm = { 3 }
                    md = { 2 }>
                    <Typography>
            Duration
                    </Typography>
                </Grid>
                <Grid
                    container
                    item
                    xs = { 12 }
                    sm = { 8 }
                    md = { 10 }
                    spacing = { 3 }>
                    <Grid item>
                        <TextField
                            id = 'duration-hours'
                            select
                            label = 'Hours'
                            value = { hours }
                            onChange = { e => setHours(e.target.value) }
                            error = { Boolean(durationError) } >
                            {hoursArray.map(el => (<MenuItem
                                key = { el }
                                value = { el }>{el}</MenuItem>))}
                        </TextField>
                    </Grid>
                    <Grid item>
                        <TextField
                            id = 'duration-minutes'
                            select
                            label = 'Minutes'
                            value = { minutes }
                            onChange = { e => setMinutes(e.target.value) }
                            error = { Boolean(durationError) }
                            helperText = { durationError } >
                            {minutesArray.map(el => (<MenuItem
                                key = { el }
                                value = { el }>{el}</MenuItem>))}
                        </TextField>
                    </Grid>
                </Grid>
                <Grid
                    item
                    xs = { 12 }
                    sm = { 3 }
                    md = { 2 }>
                    <Typography>
            Time Zone
                    </Typography>
                </Grid>
                <Grid
                    container
                    item
                    xs = { 12 }
                    sm = { 8 }
                    md = { 10 }
                    spacing = { 3 } >
                    <Grid
                        item
                        xs = { 12 }
                        md = { 4 } >
                        <Autocomplete
                            id = 'time-zone'
                            getOptionLabel = { option => option }
                            disableClearable = { true }
                            disabled = { isEditOneOccurrence }
                            value = { timezone }
                            className = { classes.timezoneList }
                            options = { timeZonesList }
                            onChange = { (e, value) => setTimezone(value) }
                            renderInput = { params => (<TextField
                                { ...params }
                                variant = 'outlined'
                                margin = 'normal' />) } />
                    </Grid>
                </Grid>
            </Grid>

            <Grid
                container
                spacing = { 2 }>
                <Grid
                    item
                    sm = { 12 }
                    md = { 6 }>
                    <FormControlLabel
                        label = 'Recurring meeting'
                        control = { <Switch
                            name = 'recurringMeeting'
                            checked = { recurringMeeting }
                            onChange = { e => {
                                setChangesMadeByUserActions(true);
                                setRecurringMeeting(e.target.checked);
                            } }
                            disabled = { isEditOneOccurrence } />
                        } />
                </Grid>
                {recurringMeeting && <Grid
                    item
                    sm = { 12 }
                    md = { 6 }>
                    <Typography> {recurrenceDesc()} </Typography>
                </Grid>
                }
            </Grid>
            {recurringMeeting && !isEditOneOccurrence
                && <Grid
                    container
                    alignItems = 'center'
                    spacing = { 2 }>
                    <Grid
                        item
                        xs = { 12 }
                        sm = { 3 }
                        md = { 2 }>
                        <Typography>
                            Recurrence
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs = { 12 }
                        sm = { 8 }
                        md = { 10 }>

                        <TextField
                            id = 'recurrence-type'
                            select
                            value = { recurrenceType }
                            onChange = { e => {
                                setChangesMadeByUserActions(true);
                                setRecurrenceType(e.target.value);
                            } }>
                            {recurrenceTypeArray.map(el => (<MenuItem
                                key = { el }
                                value = { el }>{recurrenceTypeMap[el]}</MenuItem>))}
                        </TextField>
                    </Grid>
                    <Grid
                        item
                        xs = { 12 }
                        sm = { 3 }
                        md = { 2 }>
                        <Typography>
                            Repeat every
                        </Typography>
                    </Grid>

                    <Grid
                        container
                        item
                        xs = { 12 }
                        sm = { 8 }
                        md = { 10 }
                        spacing = { 1 }>
                        {recurrenceType === 'daily'
                            && <Grid item>
                                <TextField
                                    id = 'recurrence-interval'
                                    select
                                    SelectProps = {{ MenuProps }}
                                    label = { repeatIntervalMap[recurrenceType].label }
                                    value = { recurrenceInterval }
                                    onChange = { e => {
                                        setChangesMadeByUserActions(true);
                                        setRecurrenceInterval(e.target.value);
                                    } }>
                                    {repeatIntervalMap.daily.interval.map(el => (<MenuItem
                                        key = { el }
                                        value = { el }>{el}</MenuItem>))}
                                </TextField>
                            </Grid>
                        }

                        {recurrenceType === 'weekly'
                            && <Grid item>
                                {daysOfWeekArray.map(el => (<FormControlLabel
                                    key = { el }
                                    label = { el }
                                    control = { <Checkbox
                                        name = { el }
                                        checked = { daysOfWeek[el] }
                                        disabled = { daysOfWeek[el] && selectedNumberDaysOfWeek.length === 1 }
                                        onChange = { e => setDaysOfWeek({
                                            ...daysOfWeek,
                                            [e.target.name]: e.target.checked
                                        }) } />
                                    } />))}
                            </Grid>
                        }

                        {recurrenceType === 'monthly'
                            && <>
                                <Grid
                                    container
                                    item
                                    alignItems = 'center'
                                    spacing = { 1 }>
                                    <Grid item>
                                        <FormControlLabel
                                            label = 'Day'
                                            control = { <Radio
                                                name = 'monthlyBy'
                                                value = 'monthlyByDay'
                                                checked = { monthlyBy === 'monthlyByDay' }
                                                onChange = { e => setMonthlyBy(e.target.value) } />
                                            } />
                                    </Grid>
                                    <Grid item>
                                        <TextField
                                            id = 'monthly-by-day'
                                            select
                                            SelectProps = {{ MenuProps }}
                                            disabled = { monthlyBy !== 'monthlyByDay' }
                                            value = { monthlyByDay }
                                            onChange = { e => setMonthlyByDay(e.target.value) }>
                                            {repeatIntervalMap.monthly.interval.map(el => (<MenuItem
                                                key = { el }
                                                value = { el }>{el}</MenuItem>))}
                                        </TextField>
                                    </Grid>
                                    <Grid item>
                                        <Typography>of the month</Typography>
                                    </Grid>
                                </Grid>

                                <Grid
                                    item
                                    xs = { 12 }>
                                    <Typography>
                                        or
                                    </Typography>
                                </Grid>
                                <Grid
                                    container
                                    item
                                    alignItems = 'center'
                                    spacing = { 1 }>
                                    <Grid item>
                                        <FormControlLabel
                                            label = 'The'
                                            control = { <Radio
                                                name = 'monthlyBy'
                                                value = 'monthlyByWeekDay'
                                                checked = { monthlyBy === 'monthlyByWeekDay' }
                                                onChange = { e => setMonthlyBy(e.target.value) } />
                                            } />
                                    </Grid>
                                    <Grid item>
                                        <TextField
                                            id = 'monthly-by-week-index'
                                            select
                                            margin = 'normal'
                                            disabled = { monthlyBy !== 'monthlyByWeekDay' }
                                            value = { monthlyByPosition }
                                            onChange = { e => setMonthlyByPosition(e.target.value) }>
                                            {monthlyByPositionArray.map(el => (<MenuItem
                                                key = { el }
                                                value = { el }>{el}</MenuItem>))}
                                        </TextField>
                                    </Grid>
                                    <Grid item>
                                        <TextField
                                            id = 'monthly-by-week-day'
                                            select
                                            margin = 'normal'
                                            disabled = { monthlyBy !== 'monthlyByWeekDay' }
                                            value = { monthlyByWeekDay }
                                            onChange = { e => setMonthlyByWeekDay(e.target.value) }>
                                            {daysOfWeekArray.map(el => (<MenuItem
                                                key = { el }
                                                value = { el }>{el}</MenuItem>))}
                                        </TextField>
                                    </Grid>
                                    <Grid item>
                                        <Typography>of the month</Typography>
                                    </Grid>
                                </Grid>
                            </>
                        }
                    </Grid>

                    <Grid
                        item
                        xs = { 12 }
                        sm = { 3 }
                        md = { 2 }>
                        <Typography>
                            End date
                        </Typography>
                    </Grid>
                    <Grid
                        container
                        item
                        alignItems = 'center'
                        xs = { 12 }
                        sm = { 8 }
                        md = { 10 }
                        spacing = { 1 }>
                        <Grid
                            container
                            item
                            alignItems = 'center'
                            xs = { 12 }
                            spacing = { 1 }>
                            <Grid item>
                                <FormControlLabel
                                    label = 'By'
                                    control = { <Radio
                                        name = 'endDate'
                                        value = 'endDateTime'
                                        checked = { endDateBy === 'endDateTime' }
                                        onChange = { e => {
                                            setChangesMadeByUserActions(true);
                                            setEndDateBy(e.target.value);
                                        } } />
                                    } />
                            </Grid>
                            <Grid item>
                                <MuiPickersUtilsProvider utils = { MomentUtils }>
                                    <KeyboardDatePicker
                                        autoOk
                                        disableToolbar
                                        variant = 'inline'
                                        format = 'MM/DD/YYYY'
                                        margin = 'normal'
                                        id = 'date-picker-inline'
                                        disabled = { endDateBy !== 'endDateTime' }
                                        maxDate = { endDateBy === 'endDateTime'
                                            ? recurrenceMaxEndDate[recurrenceType]
                                            : undefined }
                                        minDate = { endDateBy === 'endDateTime' ? date : undefined }
                                        label = 'End Date'
                                        value = { endDate || date }
                                        onChange = { d => setEndDate(d) }
                                        InputProps = {{ readOnly: true,
                                            classes: {
                                                input: classes.datePickerInput
                                            }
                                        }}
                                        KeyboardButtonProps = {{
                                            'aria-label': 'change date'
                                        }} />
                                </MuiPickersUtilsProvider>
                            </Grid>
                        </Grid>

                        <Grid
                            item
                            sm = { 12 }>
                            <Typography>
                                or
                            </Typography>
                        </Grid>
                        <Grid
                            container
                            item
                            spacing = { 1 }
                            alignItems = 'center'>
                            <Grid item>
                                <FormControlLabel
                                    label = 'After'
                                    control = { <Radio
                                        name = 'endDate'
                                        value = 'endTimes'
                                        checked = { endDateBy === 'endTimes' }
                                        onChange = { e => setEndDateBy(e.target.value) } />
                                    } />
                            </Grid>
                            <TextField
                                id = 'end-times'
                                select
                                margin = 'normal'
                                label = 'Occurrences'
                                SelectProps = {{ MenuProps }}
                                disabled = { endDateBy !== 'endTimes' }
                                value = { endTimes }
                                onChange = { e => setEndTimes(e.target.value) }>
                                {recurrenceIntervalArray.map(el => (<MenuItem
                                    key = { el }
                                    value = { el }>{el}</MenuItem>))}
                            </TextField>
                        </Grid>
                    </Grid>
                </Grid>
            }

            <Grid
                container
                spacing = { 1 }>
                <Grid
                    item
                    xs = { 12 }>
                    <FormControlLabel
                        label = 'Allow anonymous users'
                        control = { <Checkbox
                            name = 'allowAnonymous'
                            checked = { allowAnonymous }
                            onChange = { e => setAllowAnonymous(e.target.checked) } />
                        } />
                </Grid>

                <Grid
                    item
                    xs = { 12 }>
                    <FormControlLabel
                        label = 'Wait for a host of the meeting'
                        control = { <Checkbox
                            name = 'waitForHost'
                            checked = { waitForHost }
                            onChange = { e => setWaitForHost(e.target.checked) } />
                        } />
                </Grid>

                <Grid
                    item
                    xs = { 12 }>
                    <FormControlLabel
                        label = 'Forbid new participants after the meeting is over'
                        control = { <Checkbox
                            name = 'forbidNewParticipantsAfterDateEnd'
                            checked = { forbidNewParticipantsAfterDateEnd }
                            onChange = { e => setForbidNewParticipantsAfterDateEnd(e.target.checked) } />
                        } />
                </Grid>

                <Grid
                    container
                    spacing = { 2 }>
                    <Grid
                        item
                        xs = { 12 }>
                        <FormControlLabel
                            label = 'Multiple rooms in one meeting'
                            control = { <Switch
                                name = 'isMultipleRooms'
                                checked = { isMultipleRooms }
                                onChange = { e => setisMultipleRooms(e.target.checked) } />
                            } />
                    </Grid>
                    {isMultipleRooms
                        && <Grid item>
                            <TextField
                                id = 'multipleRooms'
                                select
                                label = 'Quantity'
                                value = { multipleRooms }
                                onChange = { e => setmultipleRooms(e.target.value) }>
                                {multipleMeetingArray.map(el => (<MenuItem
                                    key = { el }
                                    value = { el }>{ el }</MenuItem>))}
                            </TextField>
                        </Grid>
                    }
                </Grid>
            </Grid>

            <Typography color = 'error'>
                {/* {loginError} */}
            </Typography>
            <Grid
                container
                spacing = { 3 }>
                <Grid item>
                    {isAnon
                        ? <Button
                            variant = 'contained'
                            color = 'primary'
                            onClick = { doLogout }
                            className = { classes.submit }>
                            Register to schedule meetings
                        </Button>
                        : <Button
                            type = 'submit'
                            variant = 'contained'
                            color = 'primary'
                            className = { classes.submit }
                            disabled = { loading || updateLoading }>
                            Save
                        </Button>
                    }

                </Grid>
                <Grid item>
                    <Button
                        variant = 'outlined'
                        className = { classes.submit }
                        onClick = { () => history.goBack() }>
            Cancel
                    </Button>
                </Grid>
            </Grid>
            {(error || updateError) && <Alert
                className = { classes.formAlert }
                severity = 'error'
                variant = 'outlined'>{ error || (isEditing && updateError)}</Alert> }
        </form>
    );
};

SchedulerForm.propTypes = {
    doLogout: PropTypes.func,
    error: PropTypes.string,
    isAnon: PropTypes.bool,
    isEditing: PropTypes.bool,
    loading: PropTypes.bool,
    meeting: PropTypes.any,
    scheduleMeeting: PropTypes.func,
    updateError: PropTypes.string,
    updateLoading: PropTypes.bool,
    updateScheduleMeeting: PropTypes.func,
    updateScheduleMeetingRecurringSingleOccurrence: PropTypes.func,
    updateScheduleMeetingsRecurring: PropTypes.func,
    userId: PropTypes.string
};

const mapStateToProps = state => {
    return {
        userId: state['features/riff-platform'].signIn.user?.uid,
        isAnon: Boolean(state['features/riff-platform'].signIn.user?.isAnon),
        loading: state['features/riff-platform'].scheduler.loading,
        error: state['features/riff-platform'].scheduler.error,
        updateError: state['features/riff-platform'].scheduler.updateError,
        updateLoading: state['features/riff-platform'].scheduler.updateLoading
    };
};

const mapDispatchToProps = dispatch => {
    return {
        doLogout: () => dispatch(logout()),
        scheduleMeeting: (meeting, history) => dispatch(schedule(meeting, history)),
        updateScheduleMeeting: (id, meeting, history) => dispatch(updateSchedule(id, meeting, history)),
        updateScheduleMeetingsRecurring: (roomId, meeting, history) =>
            dispatch(updateScheduleRecurring(roomId, meeting, history)),
        updateScheduleMeetingRecurringSingleOccurrence: (roomId, id, meeting, history) =>
            dispatch(updateScheduleRecurringSingleOccurrence(roomId, id, meeting, history))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SchedulerForm);
