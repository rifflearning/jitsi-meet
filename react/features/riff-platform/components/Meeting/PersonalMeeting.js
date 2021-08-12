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
    showDetailsEnabled = false,
    title
}) {
    const history = useHistory();
    const classes = useStyles();

    const [ isLinkCopied, setLinkCopied ] = useState(false);
    const [ isDetailsShown, setIsDetailsShown ] = useState(!showDetailsEnabled);

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

    const handleShowDetails = value => setIsDetailsShown(value);

    const handleEditClick = () => {
        const url = `${ROUTES.MEETINGS}/${meeting._id}/edit`;

        return history.push(url);
    };

    const defineIcon = {
        true: <CheckCircleOutline />,
        false: <HighlightOffOutlined />
    };

    const noPersonalRoom = 'The user doesn`t have personal meeting room';

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return errorMessage(error);
    }
    if (!meeting._id) {
        return <StyledPaper title = { title }>{noPersonalRoom}</StyledPaper>;
    }

    return (
        <StyledPaper title = { title }>
            { isDetailsShown
                ? <Grid
                    alignItems = 'center'
                    className = { classes.container }
                    container = { true }
                    item = { true }
                    spacing = { 4 }
                    xs = { 12 }>
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
                            onClick = { handleEditClick }
                            variant = 'outlined'>Edit</Button>
                        {showDetailsEnabled
                           && <Button
                               className = { classes.meetingButton }
                               onClick = { () => handleShowDetails(false) }>
                                    Hide details
                           </Button>}
                    </Grid>
                </Grid>
                : <Grid
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
                                Show details
                        </Button>
                    </Grid>
                </Grid>}
        </StyledPaper>
    );
}

UserPersonalMeetingRoom.propTypes = {
    error: PropTypes.string,
    fetchPersonalMeeting: PropTypes.func,
    loading: PropTypes.bool,
    meeting: PropTypes.object,

    // uses for the possibility to show main content with show more details button
    showDetailsEnabled: PropTypes.bool,
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
