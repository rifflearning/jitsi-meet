/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-sort-props */

import { makeStyles, MenuItem, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

import { connect } from '../../../base/redux';
import { getNumberRangeArray } from '../../functions';


const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: 200,
            color: '#fff',
            fontSize: '12px',
            lineHeight: '16px',
            background: 'rgba(0,0,0,.8)'
        }
    }
};

const useStyles = makeStyles({
    root: {
        pointerEvents: 'auto',
        marginLeft: '5px',
        '& .MuiOutlinedInput-input': {
            background: 'rgba(0,0,0,.8)',
            borderRadius: '3px 0 0 3px',
            display: 'inline-block',
            color: '#fff',
            fontSize: '12px',
            lineHeight: '16px',
            minWidth: '34px',
            padding: '6px 30px 6px 8px'
        },
        '& .Mui-focused .MuiOutlinedInput-notchedOutline ': {
            border: '0',
            borderRadius: '4px'
        },
        '& .MuiSelect-icon': {
            color: '#fff'
        }
    },
    selectItem: {
        background: 'rgba(0,0,0,.8)',
        color: '#fff',
        fontSize: '12px',
        lineHeight: '16px'
    }
});

const MultipleRoomsMeetingDropdown = ({ meetingId, meetingName, multipleRoomsQuantity }) => {
    const classes = useStyles();

    const redirectToMeeting = id => {
        // Need to reload page
        window.location.replace(`/${id}`);
    };

    const checkIsSameMeeting = selectedId => meetingId === selectedId;

    const onMeetingRoomChange = roomNumber => {
        const id = meetingId.split('-')[0];
        const selectedMeetingId = `${id}-${roomNumber}`;
        const isSameMeeting = checkIsSameMeeting(selectedMeetingId);

        if (!isSameMeeting) {
            redirectToMeeting(`${id}-${roomNumber}`);
        }
    };

    const roomsNumbersArr = getNumberRangeArray(1, multipleRoomsQuantity);

    const roomNumber = meetingId.split('-')[1];


    return (<TextField
        className = { classes.root }
        id = 'meeting-dropdown'
        onChange = { e => onMeetingRoomChange(e.target.value) }
        SelectProps = {{ MenuProps }}
        select = { true }
        value = { roomNumber }
        variant = 'outlined'>
        {roomsNumbersArr.map(el => (<MenuItem
            className = { classes.selectItem }
            key = { el }
            value = { el }>
            {meetingName}-{el}
        </MenuItem>))}
    </TextField>

    );
};

MultipleRoomsMeetingDropdown.propTypes = {
    meetingId: PropTypes.string,
    meetingName: PropTypes.string,
    multipleRoomsQuantity: PropTypes.number
};

const mapStateToProps = state => {
    return {
        multipleRoomsQuantity: state['features/riff-platform']?.meeting?.meeting?.multipleRoomsQuantity,
        meetingName: state['features/riff-platform']?.meeting?.meeting?.name,
        meetingId: state['features/base/conference'].room
    };
};


export default connect(mapStateToProps)(MultipleRoomsMeetingDropdown);
