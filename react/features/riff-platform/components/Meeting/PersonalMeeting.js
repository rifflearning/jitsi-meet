/* eslint-disable require-jsdoc */
/* eslint-disable react/no-multi-comp */
/* eslint-disable react/jsx-no-bind */

import {
    Button,
    Grid,
    Typography,
    Box,
    Divider,
    makeStyles
} from '@material-ui/core';
import { CheckCircleOutline, HighlightOffOutlined } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import { connect } from '../../../base/redux';
import { getUserPersonalMeetingRoom } from '../../actions/personalMeeting';
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
            marginLeft: '10px',
            marginTop: '10px'
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

    const classes = useStyles();

    const [ isLinkCopied, setLinkCopied ] = useState(false);

    useEffect(() => {
        if (!meeting._id) {
            fetchPersonalMeeting();
        }
    }, [ ]);

    const handleLinkCopy = () => {
        const id = meeting.roomId;

        navigator.clipboard.writeText(`${window.location.origin}/${id}`);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 1000);
    };

    const handleStartClick = () => {
        const id = meeting.roomId;

        // Need to reload page
        return window.location.replace(`/${id}`);
    };

    const defineIcon = {
        true: <CheckCircleOutline />,
        false: <HighlightOffOutlined />
    };

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return errorMessage(error);
    }

    return (
        <Grid
            container = { true }
            spacing = { 3 }>
            <Grid
                item = { true }
                xs = { 12 }>
                <StyledPaper>
                    <Grid
                        alignItems = 'center'
                        className = { classes.container }
                        container = { true }
                        item = { true }
                        spacing = { 4 }
                        xs = { 12 } >
                        <Grid
                            alignItems = 'center'
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
                                    <Box pr = { 1 }>{defineIcon[Boolean(meeting.waitForHost)]}</Box>
                                    <Typography>
                                       Wait for a host of the meeting
                                    </Typography>
                                </Grid>
                                <Grid
                                    container = { true }
                                    item = { true }>
                                    <Box pr = { 1 }>{defineIcon[Boolean(meeting.forbidNewParticipantsAfterDateEnd)]}</Box>
                                    <Typography>
                                        Forbid new participants after the meeting is over
                                    </Typography>
                                </Grid>
                                <Grid
                                    container = { true }
                                    item = { true }>
                                    <Box pr = { 1 }>{defineIcon[Boolean(meeting.allowAnonymous)]}</Box>
                                    <Typography>
                                         Allow guest users
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Divider className = { classes.infoDivider } />
                        <Grid
                            alignItems = 'center'
                            container = { true }
                            item = { true }
                            spacing = { 3 }>
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
                                color = 'default'

                                // onClick = { handleEditClick }
                                variant = 'outlined'>Edit</Button>
                        </Grid>
                    </Grid>
                </StyledPaper>
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
