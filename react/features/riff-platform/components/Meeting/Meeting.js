/* eslint-disable require-jsdoc */
/* eslint-disable react/no-multi-comp */
/* eslint-disable react/jsx-no-bind */

import {
    Button,
    Grid,
    Typography,
    Box,
    Divider,
    makeStyles,
    MenuItem,
    TextField
} from '@material-ui/core';
import { CheckCircleOutline, HighlightOffOutlined } from '@material-ui/icons';
import moment from 'moment';
import momentTZ from 'moment-timezone';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useHistory } from 'react-router';

import { connect } from '../../../base/redux';
import {
    deleteMeeting,
    deleteMeetingsRecurring
} from '../../actions/meetings';
import { isGoogleCalendarEnabled, isMsCalendarEnabled } from '../../calendarSyncFunctions';
import * as ROUTES from '../../constants/routes';
import { getNumberRangeArray, formatDurationTime } from '../../functions';
import AddToGoogleCalendarButton from '../Calendar/AddToGoogleCalendarButton';
import AddToMsCalendarButton from '../Calendar/AddToMicrosoftCalendarButton';
import Loader from '../Loader';
import { ConfirmationDialogRaw } from '../Meetings/Dialog';

const useStyles = makeStyles(() => {
    return {
        meetingButton: {
            marginTop: '10px',
            '&:not(:first-child)': {
                marginLeft: '10px'
            }
        },
        infoDivider: {
            width: '100%'
        },
        container: {
            margin: '0px' // fix scroll
        },
        rightColumn: {
            '& > .MuiGrid-item': {
                paddingLeft: '0px'
            }
        },
        meetingTimezone: {
            opacity: 0.7,
            fontSize: '0.9rem',
            marginTop: '10px !important'
        },
        box: {
            margin: '16px 0 16px 0'
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

const getFormattedDate = (dateStart, dateEnd, timezone) => {
    const duration = timezone
        ? formatDurationTime(momentTZ.tz(dateStart, timezone), momentTZ.tz(dateEnd, timezone))
        : formatDurationTime(dateStart, dateEnd);
    const date = moment(dateStart).format('MMM DD, YYYY');

    return `${duration}, ${date}`;
};

const repeatIntervalMap = {
    daily: 'day(s)',
    weekly: 'week',
    monthly: 'month'
};

const getRecurrenceDesc = (recurring = {}) => {
    const intervalPart = `Every ${recurring.recurrenceType === 'daily' ? recurring.dailyInterval : ''
    } ${repeatIntervalMap[recurring.recurrenceType]}`;

    const endDatePart = `${recurring.dateEnd
        ? `, until ${moment(recurring.dateEnd).format('MMM DD, YYYY')}`
        : ''
    }`;

    const daysOfWeekPart = `${recurring.recurrenceType === 'weekly'
        ? recurring.daysOfWeek.length > 0
            ? ` on ${recurring.daysOfWeek.join(', ')}`
            : ''
        : ''
    }`;

    const daysOfMonthPart = `${recurring.recurrenceType === 'monthly'
        ? recurring.monthlyByDay
            ? ` on the ${recurring.monthlyByDay} of the month`
            : ` on the ${recurring.monthlyByPosition} ${recurring.monthlyByWeekDay}`
        : ''
    }`;

    const occurrencePart = recurring.timesEnd ? `, ${recurring.timesEnd} occurrence(s)` : '';

    return `${intervalPart}${daysOfWeekPart}${daysOfMonthPart}${endDatePart}${occurrencePart}`;
};

function Meeting({
    meeting = {},
    roomNumber,
    removeMeeting,
    removeMeetingsRecurring,
    userId,
    deleteLoading,
    isCalendarEnabled,
    onEditClick
}) {

    const history = useHistory();
    const classes = useStyles();

    const [ multipleRoom, setmultipleRooms ] = useState(roomNumber ? roomNumber : 1);
    const [ isLinkCopied, setLinkCopied ] = useState(false);
    const [ isOpenDeleteDialog, setisOpenDeleteDialog ] = useState(false);
    const [ isOpenEditDialog, setIsOpenEditDialog ] = useState(false);

    const handleLinkCopy = () => {
        const id = meeting.multipleRoomsQuantity
            ? `${meeting.roomId}-${multipleRoom}`
            : meeting.roomId;

        // onclick Copy button copy meeting link + description, Beth's request
        // but not for the personal meeting room
        const description = meeting.description && !meeting.isPersonal ? ` ${meeting.description}` : '';

        navigator.clipboard.writeText(`${window.location.origin}/${id}${description}`);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 1000);
    };

    const handleStartClick = () => {
        const id = meeting.multipleRoomsQuantity
            ? `${meeting.roomId}-${multipleRoom}`
            : meeting.roomId;

        return history.push(`${ROUTES.WAITING}/${id}`);
    };

    const handleDeleteClick = () => setisOpenDeleteDialog(true);

    const handleEditClick = () => {
        if (onEditClick) {
            return onEditClick();
        }
        const id = meeting.multipleRoomsQuantity ? `${meeting._id}-${multipleRoom}` : meeting._id;

        if (!meeting.recurringParentMeetingId) {
            return history.push(`${ROUTES.MEETINGS}/${id}/edit`);
        }
        setIsOpenEditDialog(true);
    };

    const defineIcon = {
        true: <CheckCircleOutline />,
        false: <HighlightOffOutlined />
    };

    const onDeleteDialogClose = value => {
        const meetingsUrl = `${ROUTES.MEETINGS}`;

        if (value === 'Delete all recurring meetings') {
            removeMeetingsRecurring(meeting.roomId);

            return history.push(meetingsUrl);
        } else if (value === 'Delete one meeting') {
            removeMeeting(meeting._id);

            return history.push(meetingsUrl);
        }
        setisOpenDeleteDialog(false);
    };

    const onEditDialogClose = value => {
        const id = meeting.multipleRoomsQuantity ? `${meeting._id}-${multipleRoom}` : meeting._id;
        const url = `${ROUTES.MEETINGS}/${id}/edit`;

        if (value === 'Edit all recurring meetings') {
            return history.push(`${url}?mode=all`);
        } else if (value === 'Edit one meeting' && meeting.recurringParentMeetingId) {
            return history.push(`${url}?mode=one`);
        }
        setIsOpenEditDialog(false);
    };

    const dialogDeleteValues = [ 'Delete one meeting',
        meeting.recurringParentMeetingId ? 'Delete all recurring meetings' : undefined ];

    const dialogEditValues = [ 'Edit one meeting',
        meeting.recurringParentMeetingId ? 'Edit all recurring meetings' : undefined ];

    const roomsNumbersArr = meeting.multipleRoomsQuantity ? getNumberRangeArray(1, meeting.multipleRoomsQuantity) : [];

    const isMeetingcreatedByCurrentUser = meeting?.createdBy === userId;
    const localUserTimezone = momentTZ.tz.guess();

    const isSameDay = momentTZ.tz(meeting.dateStart, localUserTimezone).format('DD')
        === momentTZ.tz(meeting.dateStart, meeting.timezone).format('DD');

    const timezoneTimeInfo = `${momentTZ.tz(meeting.dateStart, meeting.timezone).format('HH:mm')} -
    ${momentTZ.tz(meeting.dateEnd, meeting.timezone).format('HH:mm')}, 
    ${isSameDay ? '' : `${momentTZ.tz(meeting.dateStart, meeting.timezone).format('MMM DD')},`}
     ${meeting.timezone}`;

    return (
        <Grid
            alignItems = 'center'
            container = { true }
            item = { true }
            xs = { 12 } >
            <Grid
                alignItems = 'center'
                className = { classes.box }
                container = { true }
                item = { true }>
                <Grid
                    item = { true }
                    md = { 2 }
                    sm = { 3 }
                    xs = { 12 }>
                    <Typography>
                        Name
                    </Typography>
                </Grid>
                <Grid
                    item = { true }
                    md = { 10 }
                    sm = { 8 }
                    xs = { 12 } >
                    <Typography>
                        {meeting.name}
                    </Typography>
                </Grid>
            </Grid>
            <Divider className = { classes.infoDivider } />
            <Grid
                alignItems = 'center'
                className = { classes.box }
                container = { true }
                item = { true }>
                <Grid
                    item = { true }
                    md = { 2 }
                    sm = { 3 }
                    xs = { 12 }>
                    <Typography>
                        Description
                    </Typography>
                </Grid>
                <Grid
                    item = { true }
                    md = { 10 }
                    sm = { 8 }
                    xs = { 12 }>
                    <Typography>
                        {meeting.description}
                    </Typography>
                </Grid>
            </Grid>
            <Divider className = { classes.infoDivider } />
            {!meeting?.isPersonal
            && <>
                <Grid
                    alignItems = 'center'
                    className = { classes.box }
                    container = { true }
                    item = { true }>
                    <Grid
                        item = { true }
                        md = { 2 }
                        sm = { 3 }
                        xs = { 12 }>
                        <Typography>
                        Time
                        </Typography>
                    </Grid>
                    <Grid
                        alignItems = 'center'
                        container = { true }
                        item = { true }
                        md = { 10 }
                        sm = { 8 }
                        spacing = { 2 }
                        xs = { 12 }>
                        <Grid container = { true }>
                            <Typography>
                                {getFormattedDate(meeting.dateStart, meeting.dateEnd, meeting.timezone)}
                            </Typography>
                        </Grid>
                        {meeting?.timezone && localUserTimezone !== meeting?.timezone
                        && <Grid container = { true }>
                            <Typography
                                className = { classes.meetingTimezone }>
                                {timezoneTimeInfo}
                            </Typography>
                        </Grid>}
                    </Grid>
                </Grid>
                <Divider className = { classes.infoDivider } />
                {meeting.recurrenceOptions
                && <>
                    <Grid
                        alignItems = 'center'
                        className = { classes.box }
                        container = { true }
                        item = { true }>
                        <Grid
                            item = { true }
                            md = { 2 }
                            sm = { 3 }
                            xs = { 12 }>
                            <Typography>
                                Recurring meeting
                            </Typography>
                        </Grid>
                        <Grid
                            alignItems = 'center'
                            container = { true }
                            item = { true }
                            md = { 10 }
                            sm = { 8 }
                            spacing = { 2 }
                            xs = { 12 }>
                            <Typography>
                                {getRecurrenceDesc(meeting?.recurrenceOptions?.options)}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Divider className = { classes.infoDivider } />
                </>

                }
            </>
            }
            {isCalendarEnabled
                && <>
                    <Grid
                        alignItems = 'center'
                        className = { classes.box }
                        container = { true }
                        item = { true }>
                        <Grid
                            item = { true }
                            md = { 2 }
                            sm = { 3 }
                            xs = { 12 }>
                            <Typography>
                                Add to calendar
                            </Typography>
                        </Grid>
                        <Grid
                            alignItems = 'center'
                            container = { true }
                            item = { true }
                            md = { 10 }
                            sm = { 8 }
                            spacing = { 2 }
                            xs = { 12 }>
                            <Grid item = { true }>
                                <AddToGoogleCalendarButton
                                    meeting = { meeting }
                                    multipleRoom = { multipleRoom } />
                            </Grid>
                            <Grid item = { true }>
                                <AddToMsCalendarButton
                                    meeting = { meeting }
                                    multipleRoom = { multipleRoom } />
                            </Grid>

                        </Grid>
                    </Grid>
                    <Divider className = { classes.infoDivider } />
                </>
            }
            <Grid
                alignItems = 'center'
                className = { classes.box }
                container = { true }
                item = { true }>
                <Grid
                    item = { true }
                    md = { 2 }
                    sm = { 3 }
                    xs = { 12 }>
                    <Typography>
                        Meeting Options
                    </Typography>
                </Grid>
                <Grid
                    alignItems = 'center'
                    className = { classes.rightColumn }
                    container = { true }
                    direction = 'column'
                    item = { true }
                    md = { 10 }
                    sm = { 8 }
                    spacing = { 2 }
                    xs = { 12 }>
                    <Grid
                        container = { true }
                        item = { true }>
                        <Box pr = { 1 }>{defineIcon[meeting.waitForHost]}</Box>
                        <Typography>
                            Wait for a host of the meeting
                        </Typography>
                    </Grid>
                    {!meeting?.isPersonal
                    && <Grid
                        container = { true }
                        item = { true }>
                        <Box pr = { 1 }>{defineIcon[meeting.forbidNewParticipantsAfterDateEnd]}</Box>
                        <Typography>
                            Forbid new participants after the meeting is over
                        </Typography>
                    </Grid>
                    }
                    <Grid
                        container = { true }
                        item = { true }>
                        <Box pr = { 1 }>{defineIcon[meeting.allowAnonymous]}</Box>
                        <Typography>
                            Allow guest users
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Divider className = { classes.infoDivider } />
            {meeting.multipleRoomsQuantity
                && <>
                    <Grid
                        alignItems = 'center'
                        className = { classes.box }
                        container = { true }
                        item = { true }>
                        <Grid
                            item = { true }
                            md = { 2 }
                            sm = { 3 }
                            xs = { 12 }>
                            <Typography>
                                Room Number
                            </Typography>
                        </Grid>
                        <Grid
                            item = { true }
                            md = { 10 }
                            sm = { 8 }
                            xs = { 12 }>
                            <TextField
                                id = 'room-number'
                                select = { true }
                                // eslint-disable-next-line react/jsx-sort-props
                                SelectProps = {{ MenuProps }}
                                value = { multipleRoom }
                                // eslint-disable-next-line react/jsx-no-bind, react/jsx-sort-props
                                onChange = { e => setmultipleRooms(e.target.value) }>
                                {roomsNumbersArr.map(el => (<MenuItem
                                    key = { el }
                                    value = { el }>
                                    {el}
                                </MenuItem>))}
                            </TextField>
                        </Grid>
                    </Grid>
                    <Divider className = { classes.infoDivider } />
                </>
            }
            <Grid
                alignItems = 'center'
                className = { classes.box }
                container = { true }
                item = { true }>
                <Button
                    className = { classes.meetingButton }
                    color = 'primary'
                    onClick = { handleStartClick }
                    variant = 'contained'>Start</Button>
                <Button
                    className = { classes.meetingButton }
                    color = { isLinkCopied ? 'default' : 'primary' }
                    onClick = { handleLinkCopy }
                    variant = { isLinkCopied ? 'text' : 'outlined' }>
                    {isLinkCopied ? 'Copied!' : 'Copy link'}
                </Button>
                {isMeetingcreatedByCurrentUser
                    && <>
                        <Button
                            className = { classes.meetingButton }
                            color = 'default'
                            onClick = { handleEditClick }
                            variant = 'outlined'>
                            Edit
                        </Button>
                        {!meeting?.isPersonal
                        && <Button
                            className = { classes.meetingButton }
                            onClick = { handleDeleteClick }>
                            Delete
                        </Button>
                        }
                    </>
                }
                <ConfirmationDialogRaw
                    disabled = { deleteLoading }
                    onClose = { onDeleteDialogClose }
                    open = { isOpenDeleteDialog }
                    title = 'Delete meeting?'
                    value = { dialogDeleteValues } />
                <ConfirmationDialogRaw
                    onClose = { onEditDialogClose }
                    open = { isOpenEditDialog }
                    title = 'Edit meeting'
                    value = { dialogEditValues } />
            </Grid>
        </Grid>
    );
}

Meeting.propTypes = {
    deleteLoading: PropTypes.bool,
    isCalendarEnabled: PropTypes.bool,
    meeting: PropTypes.object,
    onEditClick: PropTypes.func,
    removeMeeting: PropTypes.func,
    removeMeetingsRecurring: PropTypes.func,
    roomNumber: PropTypes.number,
    userId: PropTypes.string
};

const mapStateToProps = state => {
    return {
        userId: state['features/riff-platform'].signIn.user?.uid,
        deleteLoading: state['features/riff-platform'].meetings.deleteLoading,
        isCalendarEnabled: isGoogleCalendarEnabled(state) && isMsCalendarEnabled(state)
    };
};

const mapDispatchToProps = dispatch => {
    return {
        removeMeeting: id => dispatch(deleteMeeting(id)),
        removeMeetingsRecurring: roomId => dispatch(deleteMeetingsRecurring(roomId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Meeting);
