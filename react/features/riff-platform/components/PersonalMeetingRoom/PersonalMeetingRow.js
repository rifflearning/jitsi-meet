/* eslint-disable require-jsdoc */
/* eslint-disable react/no-multi-comp */
/* eslint-disable react/jsx-no-bind */

import {
    Button,
    Grid,
    Typography,
    makeStyles
} from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';

import { connect } from '../../../base/redux';
import { getUserPersonalMeetingRoom } from '../../actions/personalMeeting';
import * as ROUTES from '../../constants/routes';
import Loader from '../Loader';

const useStyles = makeStyles(() => {
    return {
        meetingButton: {
            marginLeft: '10px'
        },
        itemBox: {
            padding: '0 16px'
        }
    };
});

const errorMessage = err => (<Grid
    container = { true }
    item = { true }
    justify = 'center'
    xs = { 12 }><Typography color = 'error'>{err}</Typography></Grid>);

function UserPersonalMeetingRoom({
    meeting = {},
    fetchPersonalMeeting,
    loading,
    error
}) {
    const history = useHistory();
    const classes = useStyles();

    const [ isLinkCopied, setLinkCopied ] = useState(false);

    useEffect(() => {
        if (!meeting._id) {
            fetchPersonalMeeting();
        }
    }, []);

    const handleLinkCopy = () => {

        navigator.clipboard.writeText(`${window.location.origin}/${meeting.roomId}`);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 1000);
    };

    const handleStartClick = () => history.push(`${ROUTES.WAITING}/${meeting.roomId}`);

    const handleShowDetails = () => history.push(`${ROUTES.MEETINGS}/${meeting._id}`);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return errorMessage(error);
    }

    return (
        <Grid
            alignItems = 'center'
            className = { classes.itemBox }
            container = { true }
            justify = 'space-between'>
            <Grid
                item = { true }>
                <Typography>
                    {meeting.name}
                </Typography>
            </Grid>
            <Grid
                alignItems = 'center'
                container = { true }
                item = { true }
                justify = 'flex-end'
                xs = { 6 }>
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
                <Button
                    className = { classes.meetingButton }
                    onClick = { () => handleShowDetails(true) }>
                    Details
                </Button>
            </Grid>
        </Grid>
    );
}

UserPersonalMeetingRoom.propTypes = {
    error: PropTypes.string,
    fetchPersonalMeeting: PropTypes.func,
    loading: PropTypes.bool,
    meeting: PropTypes.object
};

const mapStateToProps = state => {
    return {
        loading: state['features/riff-platform'].personalMeeting.loading,
        error: state['features/riff-platform'].personalMeeting.error,
        meeting: state['features/riff-platform'].personalMeeting.meeting
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchPersonalMeeting: () => dispatch(getUserPersonalMeetingRoom())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserPersonalMeetingRoom);
