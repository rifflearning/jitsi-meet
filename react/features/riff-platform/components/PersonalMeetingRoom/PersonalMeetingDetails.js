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
import React, { useState } from 'react';
import { useHistory } from 'react-router';

import { connect } from '../../../base/redux';
import {
    deleteMeeting,
    deleteMeetingsRecurring
} from '../../actions/meetings';
import { isGoogleCalendarEnabled, isMsCalendarEnabled } from '../../calendarSyncFunctions';
import * as ROUTES from '../../constants/routes';
import AddToGoogleCalendarButton from '../Calendar/AddToGoogleCalendarButton';
import AddToMsCalendarButton from '../Calendar/AddToMicrosoftCalendarButton';
import Loader from '../Loader';

const useStyles = makeStyles(() => {
    return {
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
        }
    };
});

function PersonalMeetingDetails({
    meeting = {},
    loading,
    isCalendarEnabled,
    handleEditClick
}) {

    const history = useHistory();
    const classes = useStyles();

    const [ isLinkCopied, setLinkCopied ] = useState(false);

    const handleLinkCopy = () => {
        navigator.clipboard.writeText(`${window.location.origin}/${meeting.roomId}`);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 1000);
    };

    const handleStartClick = () => history.push(`${ROUTES.WAITING}/${meeting.roomId}`);

    const defineIcon = {
        true: <CheckCircleOutline />,
        false: <HighlightOffOutlined />
    };

    if (loading) {
        return <Loader />;
    }
    console.log('meeting', meeting)

    return (
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
            {isCalendarEnabled
                && <>
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
                                    meeting = { meeting } />
                            </Grid>
                            <Grid item = { true }>
                                <AddToMsCalendarButton
                                    meeting = { meeting } />
                            </Grid>

                        </Grid>
                    </Grid>
                    <Divider className = { classes.infoDivider } />
                </>
            }
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
                        <Box pr = { 1 }>{defineIcon[meeting.waitForHost]}</Box>
                        <Typography>
                            Wait for a host of the meeting
                        </Typography>
                    </Grid>
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
                    onClick = { () => handleEditClick() }
                    variant = 'outlined'>
                    Edit
                </Button>
            </Grid>
        </Grid>
    );
}

PersonalMeetingDetails.propTypes = {
    handleEditClick: PropTypes.func,
    isCalendarEnabled: PropTypes.bool,
    loading: PropTypes.bool,
    meeting: PropTypes.object
};

const mapStateToProps = state => {
    return {
        isCalendarEnabled: isGoogleCalendarEnabled(state) && isMsCalendarEnabled(state)
    };
};

export default connect(mapStateToProps)(PersonalMeetingDetails);
