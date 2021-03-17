/* eslint-disable react/jsx-no-bind */

import { Button, makeStyles, MenuItem, TextField, Typography } from '@material-ui/core';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { connect } from '../../../base/redux';
import { deleteMeeting, deleteMeetingsRecurring } from '../../actions/meetings';
import * as ROUTES from '../../constants/routes';
import { getNumberRangeArray, formatDurationTime } from '../../functions';

import { ConfirmationDialogRaw } from './Dialog';

const useStyles = makeStyles(() => {
    return {
        meetingButton: {
            marginLeft: '10px',
            visibility: 'hidden',
            '@media (max-width: 768px)': {
                marginTop: '5px'
            }
        },
        tableRow: {
            '&:hover': {
                '& $meetingButton': {
                    visibility: 'visible'
                }
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

const MeetingsRow = ({
    meeting = {},
    removeMeeting,
    removeMeetingsRecurring,
    isGroup,
    deleteLoading }) => {
    const classes = useStyles();
    const history = useHistory();

    const [ multipleRoom, setmultipleRooms ] = useState(1);
    const [ isOpenDeleteDialog, setisOpenDeleteDialog ] = useState(false);
    const [ isLinkCopied, setLinkCopied ] = useState(false);

    const handleStartClick = () => {
        const id = meeting.multipleRoomsQuantity ? `${meeting.roomId}-${multipleRoom}` : meeting.roomId;

        return history.push(`${ROUTES.WAITING}/${id}`);
    };

    const handleLinkCopy = () => {
        const id = meeting.multipleRoomsQuantity
            ? `${meeting.roomId}-${multipleRoom}`
            : meeting.roomId;

        // onclick Copy button copy meeting link + description, Beth's request
        const description = meeting.description ? ` ${meeting.description}` : '';

        navigator.clipboard.writeText(`${window.location.origin}/${id}${description}`);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 1000);
    };

    const handleDeleteClick = () => setisOpenDeleteDialog(true);

    const onDeleteDialogClose = value => {
        if (value === 'Delete all recurring meetings') {
            return removeMeetingsRecurring(meeting.roomId);
        } else if (value === 'Delete one meeting') {
            return removeMeeting(meeting._id);
        }
        setisOpenDeleteDialog(false);
    };

    const durationTime = formatDurationTime(meeting.dateStart, meeting.dateEnd);

    const dialogDeleteValues = [ 'Delete one meeting',
        meeting.recurringParentMeetingId ? 'Delete all recurring meetings' : undefined ];

    const handleMeetingDetailsClick = () => {
        const id = meeting.multipleRoomsQuantity ? `${meeting._id}-${multipleRoom}` : meeting._id;

        history.push(`${ROUTES.MEETINGS}/${id}`);
    };

    const roomsNumbersArr = meeting.multipleRoomsQuantity ? getNumberRangeArray(1, meeting.multipleRoomsQuantity) : [];

    return (
        <TableRow
            className = { classes.tableRow }
            key = { meeting._id }>
            <TableCell>
                <Typography
                    component = 'p'
                    variant = 'h6' >
                    {durationTime}
                </Typography>
            </TableCell>
            <TableCell>

                {meeting.multipleRoomsQuantity
                    ? <TextField
                        id = 'room-names'
                        select = { true }
                        // eslint-disable-next-line react/jsx-sort-props
                        SelectProps = {{ MenuProps }}
                        value = { multipleRoom }
                        // eslint-disable-next-line react/jsx-no-bind, react/jsx-sort-props
                        onChange = { e => setmultipleRooms(e.target.value) }>
                        {roomsNumbersArr.map(el => (<MenuItem
                            key = { el }
                            value = { el }>
                            {meeting.name}-{el}
                        </MenuItem>))}
                    </TextField>
                    : <Typography
                        component = 'p'
                        variant = 'h6' >{meeting.name}</Typography>
                }

            </TableCell>
            <TableCell align = 'right'>
                <Button
                    className = { classes.meetingButton }
                    color = 'primary'
                    // eslint-disable-next-line react/jsx-no-bind
                    onClick = { handleStartClick }
                    variant = 'contained'>Start</Button>
                <Button
                    className = { classes.meetingButton }
                    color = { isLinkCopied ? 'default' : 'primary' }
                    onClick = { handleLinkCopy }
                    variant = { isLinkCopied ? 'text' : 'outlined' }>
                    {isLinkCopied ? 'Copied!' : 'Copy link'}
                </Button>
                <Button
                    className = { classes.meetingButton }
                    color = 'default'
                    // eslint-disable-next-line react/jsx-no-bind
                    onClick = { handleMeetingDetailsClick }
                    variant = 'outlined'>Details</Button>
                {!isGroup
                    && <Button
                        className = { classes.meetingButton }
                        // eslint-disable-next-line react/jsx-no-bind
                        onClick = { handleDeleteClick }>
                        Delete
                    </Button>
                }
                <ConfirmationDialogRaw
                    disabled = { deleteLoading }
                    onClose = { onDeleteDialogClose }
                    open = { isOpenDeleteDialog }
                    title = 'Delete meeting?'
                    value = { dialogDeleteValues } />
            </TableCell>
        </TableRow>
    );
};


MeetingsRow.propTypes = {
    deleteLoading: PropTypes.bool,

    // isGroup - external prop for separate group (harvard), disable 'delete', 'edit' buttons, fetch groupped meeting.
    isGroup: PropTypes.bool,
    meeting: PropTypes.object,
    removeMeeting: PropTypes.func,
    removeMeetingsRecurring: PropTypes.func
};

const mapStateToProps = state => {
    return {
        deleteLoading: state['features/riff-platform'].meetings.deleteLoading
    };
};

const mapDispatchToProps = dispatch => {
    return {
        removeMeeting: id => dispatch(deleteMeeting(id)),
        removeMeetingsRecurring: roomId => dispatch(deleteMeetingsRecurring(roomId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MeetingsRow);
