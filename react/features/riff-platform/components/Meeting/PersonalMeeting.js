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
import StyledPaper from '../StyledPaper';

const useStyles = makeStyles(theme => {
    return {
        paper: {
            marginTop: theme.spacing(4),
            display: 'flex',
            alignItems: 'center'
        },
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
    error,
    title
}) {
    const history = useHistory();
    const classes = useStyles();

    const [ isLinkCopied, setLinkCopied ] = useState(false);

    useEffect(() => {
        if (!meeting._id) {
            fetchPersonalMeeting();
        }
    }, [ ]);

    const handleLinkCopy = () => {
        const id = meeting.roomId;

        // onclick Copy button copy meeting link + description, Beth's request
        const description = meeting.description ? ` ${meeting.description}` : '';

        navigator.clipboard.writeText(`${window.location.origin}/${id}${description}`);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 1000);
    };

    const handleStartClick = () => {
        const id = meeting.roomId;

        return history.push(`${ROUTES.WAITING}/${id}`);
    };

    const handleShowDetails = () => history.push(`${ROUTES.MEETINGS}/${meeting._id}`);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return errorMessage(error);
    }

    return (
        <StyledPaper title = { title }>
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
        </StyledPaper>
    );
}

UserPersonalMeetingRoom.propTypes = {
    error: PropTypes.string,
    fetchPersonalMeeting: PropTypes.func,
    loading: PropTypes.bool,
    meeting: PropTypes.object,
    title: PropTypes.string
};

const mapStateToProps = state => {
    return {
        loading: state['features/riff-platform'].meetings.loading,
        error: state['features/riff-platform'].meetings.error,
        meeting: state['features/riff-platform'].personalMeeting.meeting
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchPersonalMeeting: () => dispatch(getUserPersonalMeetingRoom())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserPersonalMeetingRoom);
