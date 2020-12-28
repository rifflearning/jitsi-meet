/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-sort-props */

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
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker
} from '@material-ui/pickers';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import 'moment-recur';
import { useParams } from 'react-router-dom';

import { connect } from '../../../base/redux';
import { getMeeting } from '../../actions/meeting';
import { schedule,
    updateSchedule,
    updateScheduleRecurring,
    updateScheduleMultipleRooms
} from '../../actions/scheduler';

import {
    getRecurringDailyEventsByOccurance,
    getRecurringDailyEventsByEndDate,
    getRecurringWeeklyEventsByOccurance,
    getRecurringWeeklyEventsByEndDate,
    getRecurringMonthlyEventsByOccurance,
    getRecurringMonthlyEventsByEndDate,
    daysOfWeekMap
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

const getNumberArr = length => Array.from(Array(length).keys(), n => n + 1);

const hoursArray = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
const minutesArray = [ 0, 15, 30, 45 ];

// eslint-disable-next-line max-len
const multipleMeetingArray = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25 ];
const recurrenceIntervalArray = getNumberArr(20);
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
        interval: getNumberArr(15)
    },
    weekly: {
        name: 'week',
        label: 'Week',
        interval: getNumberArr(12)
    },
    monthly: {
        name: 'month',
        label: 'Month',
        interval: getNumberArr(31)
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
    const checkDate = moment(endDate).isSameOrAfter(startDate);

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

const getRecurringDatesWithTime = ({ dates, startDate, duration }) => {
    const hStart = moment.utc(startDate).hours();
    const mStart = moment.utc(startDate).minutes();

    return dates.map(date => {
        const newDateStart = moment(date).set('hour', hStart)
.set('minute', mStart);
        const newDateEnd = newDateStart.clone().add('hours', duration.hours)
.add('minutes', duration.minutes);

        return {
            startDate: newDateStart.toISOString(),
            endDate: newDateEnd.toISOString()
        };
    });
};


const SchedulerForm = ({
    userId,
    loading,
    error,
    scheduleMeeting,
    isEditing,
    fetchMeeting,
    meeting,
    updateScheduleMeetingsRecurring,
    updateScheduleMeeting,
    updateScheduleMeetingsMultipleRooms,
    updateError,
    updateLoading
}) => {
    const classes = useStyles();

    const [ name, setname ] = useState('');
    const [ description, setdescription ] = useState('');
    const [ date, setdate ] = useState(moment());
    const [ hours, setHours ] = useState(1);
    const [ minutes, setMinutes ] = useState(0);
    const [ allowAnonymous ] = useState(false);
    const [ recurringMeeting, setRecurringMeeting ] = useState(false);
    const [ recurrenceType, setRecurrenceType ] = useState('daily');
    const [ recurrenceInterval, setRecurrenceInterval ] = useState(1);
    const [ endDateBy, setEndDateBy ] = useState('endDateTime');
    const [ endDate, setEndDate ] = useState(moment());
    const [ endTimes, setEndTimes ] = useState(7);
    const [ monthlyBy, setMonthlyBy ] = useState('monthlyByDay');
    const [ monthlyByPosition, setMonthlyByPosition ] = useState('First');
    const [ monthlyByWeekDay, setMonthlyByWeekDay ] = useState('Mon');
    const [ monthlyByDay, setMonthlyByDay ] = useState(Number(moment(date).format('D')));
    const [ daysOfWeek, setDaysOfWeek ] = useState({
        Sun: false,
        Mon: false,
        Tue: false,
        Wed: false,
        Thu: false,
        Fri: false,
        Sat: false,
        [moment(date).format('ddd')]: true
    });
    const [ occurrenceCount, setOccuranceCount ] = useState(defaultOccurrences);
    const [ recurrenceDate, setRecurrenceDate ] = useState([]);
    const [ waitForHost, setWaitForHost ] = useState(false);
    const [ forbidNewParticipantsAfterDateEnd, setForbidNewParticipantsAfterDateEnd ] = useState(false);

    const [ nameError, setnameError ] = useState('');
    const [ durationError, setDurationError ] = useState('');

    const [ isMultipleRooms, setisMultipleRooms ] = useState(false);
    const [ multipleRooms, setmultipleRooms ] = useState(1);

    const { id } = useParams();

    const defineEditMode = () => {
        const params = new URLSearchParams(location.search);

        return params.get('mode');
    };

    useEffect(() => {
        if (isEditing) {
            fetchMeeting(id);
        }
    }, []);

    useEffect(() => {
        if (meeting && isEditing) {
            const meetingDuration = moment
            .duration(moment(meeting.dateEnd)
            .diff(moment(meeting.dateStart)));

            const durationH = meetingDuration.asHours();
            const durationM = meetingDuration.asMinutes() - (60 * durationH);

            setHours(durationH);
            setMinutes(durationM);
            setname(meeting.name);
            setdescription(meeting.description);
            setdate(meeting.dateStart);
            setForbidNewParticipantsAfterDateEnd(meeting.forbidNewParticipantsAfterDateEnd);
            setWaitForHost(meeting.waitForHost);
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

    const isEditAllMeetingsRecurring = defineEditMode() === 'all';
    const isEditOneOccurrence = defineEditMode() === 'one';
    const isEditGrouppedMeetings = defineEditMode() === 'group';

    const handleSubmit = e => {
        e.preventDefault();
        if (!isFormValid()) {
            return;
        }

        const dateEnd = new Date(date);

        dateEnd.setHours(dateEnd.getHours() + hours);
        dateEnd.setMinutes(dateEnd.getMinutes() + minutes);

        const recurrenceValues = recurringMeeting
            ? getRecurringDatesWithTime({ dates: recurrenceDate,
                startDate: date,
                duration: { hours,
                    minutes } })
            : null;

        if (!isEditing) {
            return scheduleMeeting({
                createdBy: userId,
                name,
                description,
                dateStart: new Date(date).getTime(),
                dateEnd: dateEnd.getTime(),
                allowAnonymous,
                waitForHost,
                recurrenceValues,
                forbidNewParticipantsAfterDateEnd,
                multipleRooms: multipleRooms > 1 ? multipleRooms : null
            });
        } else if (isEditing) {
            if (isEditAllMeetingsRecurring) {
                return updateScheduleMeetingsRecurring(meeting.roomId, {
                    name,
                    description,
                    allowAnonymous,
                    waitForHost,
                    forbidNewParticipantsAfterDateEnd
                });
            } else if (isEditOneOccurrence) {
                return updateScheduleMeeting(id, {
                    description,
                    dateStart: new Date(date).getTime(),
                    dateEnd: dateEnd.getTime(),
                    allowAnonymous,
                    waitForHost,
                    forbidNewParticipantsAfterDateEnd
                });
            } else if (isEditGrouppedMeetings) {
                return updateScheduleMeetingsMultipleRooms(meeting.multipleRoomsParentId, {
                    description,
                    dateStart: new Date(date).getTime(),
                    dateEnd: dateEnd.getTime(),
                    allowAnonymous,
                    waitForHost,
                    forbidNewParticipantsAfterDateEnd
                });
            }

            return updateScheduleMeeting(id, {
                name,
                description,
                dateStart: new Date(date).getTime(),
                dateEnd: dateEnd.getTime(),
                allowAnonymous,
                waitForHost,
                recurrenceValues,
                forbidNewParticipantsAfterDateEnd,
                multipleRooms: multipleRooms > 1 ? multipleRooms : null
            });

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

    const selectedNumberDaysOfWeek = getDaysOfWeekArr(daysOfWeek).map(
        day => daysOfWeekMap[day]
    );

    useEffect(() => {
        if (endDateBy === 'endDateTime') {
            const recurrence = calculateRecurringByEndDate({
                startDate: moment.utc(date),
                endDate: moment.utc(endDate),
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
        monthlyByPosition
    ]);

    useEffect(() => {
        if (endDateBy === 'endDateTime') {
            const recurrence = calculateRecurringByEndDate({
                startDate: moment.utc(date),
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
            setEndDate(moment(recurrence[recurrence.length - 1]));
        }
    }, [
        date,
        recurrenceType,
        recurrenceInterval,
        endDateBy
    ]);

    useEffect(() => {
        if (endDateBy !== 'endDateTime') {
            const recurrence = calculateRecurringByOccurrence({
                startDate: moment.utc(date),
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
        monthlyByPosition
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

                        // disabled when edit one occurrence or meeting has multiple rooms
                        disabled = { isEditOneOccurrence || (isEditing && Boolean(meeting?.multipleRoomsParentId)) } />
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
                                    disablePast = { true }
                                    label = 'Date'
                                    value = { date }
                                    onChange = { setdate }
                                    KeyboardButtonProps = {{
                                        'aria-label': 'change date'
                                    }}
                                    disabled = { isEditAllMeetingsRecurring } />
                            </Grid>
                            <Grid item>
                                <KeyboardTimePicker
                                    autoOk
                                    margin = 'normal'
                                    id = 'time-picker'
                                    label = 'Time'
                                    value = { date }
                                    onChange = { setdate }
                                    KeyboardButtonProps = {{
                                        'aria-label': 'change time'
                                    }}
                                    disabled = { isEditAllMeetingsRecurring } />
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
                            error = { Boolean(durationError) }
                            disabled = { isEditAllMeetingsRecurring } >
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
                            helperText = { durationError }
                            disabled = { isEditAllMeetingsRecurring } >
                            {minutesArray.map(el => (<MenuItem
                                key = { el }
                                value = { el }>{el}</MenuItem>))}
                        </TextField>
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
                            onChange = { e => setRecurringMeeting(e.target.checked) }
                            disabled = { isEditOneOccurrence
                                || isEditAllMeetingsRecurring
                                || isEditGrouppedMeetings } />
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
            {recurringMeeting
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
                            onChange = { e => setRecurrenceType(e.target.value) }>
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
                                    onChange = { e => setRecurrenceInterval(e.target.value) }>
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
                                        onChange = { e => setEndDateBy(e.target.value) } />
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
                                        disablePast = { true }
                                        disabled = { endDateBy !== 'endDateTime' }
                                        maxDate = { endDateBy === 'endDateTime'
                                            ? recurrenceMaxEndDate[recurrenceType]
                                            : undefined }
                                        minDate = { endDateBy === 'endDateTime' ? date : undefined }
                                        label = 'End Date'
                                        value = { endDate || date }
                                        onChange = { setEndDate }
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
                {/* <Grid
                    item
                    xs = { 12 }>
                    <FormControlLabel
                        label = 'Allow anonymous users'
                        control = { <Checkbox
                            name = 'allowAnonymous'
                            checked = { allowAnonymous }
                            onChange = { e => setAllowAnonymous(e.target.checked) } />
                        } />
                </Grid> */}

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
                                onChange = { e => setisMultipleRooms(e.target.checked) }
                                disabled = { isEditOneOccurrence
                                    || isEditAllMeetingsRecurring
                                    || isEditGrouppedMeetings } />
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
                    <Button
                        type = 'submit'
                        variant = 'contained'
                        color = 'primary'
                        className = { classes.submit }
                        disabled = { loading || updateLoading }>
            Save
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant = 'outlined'
                        className = { classes.submit }
                        onClick = { () => history.back() }>
            Cancel
                    </Button>
                </Grid>
                <Typography color = 'error'>
                    {error || (isEditing && updateError)}
                </Typography>
            </Grid>
        </form>
    );
};

SchedulerForm.propTypes = {
    error: PropTypes.string,
    fetchMeeting: PropTypes.func,
    isEditing: PropTypes.bool,
    loading: PropTypes.bool,
    meeting: PropTypes.any,
    scheduleMeeting: PropTypes.func,
    updateError: PropTypes.string,
    updateLoading: PropTypes.bool,
    updateScheduleMeeting: PropTypes.func,
    updateScheduleMeetingsMultipleRooms: PropTypes.func,
    updateScheduleMeetingsRecurring: PropTypes.func,
    userId: PropTypes.string
};

const mapStateToProps = state => {
    return {
        userId: state['features/riff-platform'].signIn.user?.uid,
        loading: state['features/riff-platform'].scheduler.loading,
        error: state['features/riff-platform'].scheduler.error,
        meeting: state['features/riff-platform'].meeting.meeting,
        updateError: state['features/riff-platform'].scheduler.updateError,
        updateLoading: state['features/riff-platform'].scheduler.updateLoading
    };
};

const mapDispatchToProps = dispatch => {
    return {
        scheduleMeeting: meeting => dispatch(schedule(meeting)),
        fetchMeeting: id => dispatch(getMeeting(id)),
        updateScheduleMeeting: (id, meeting) => dispatch(updateSchedule(id, meeting)),
        updateScheduleMeetingsRecurring: (roomId, meeting) => dispatch(updateScheduleRecurring(roomId, meeting)),
        updateScheduleMeetingsMultipleRooms: (id, meeting) => dispatch(updateScheduleMultipleRooms(id, meeting))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SchedulerForm);
