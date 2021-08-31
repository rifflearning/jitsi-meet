/* eslint-disable react/jsx-no-bind */
/* global interfaceConfig */
import { Button, Grid, Typography, makeStyles, Box } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

import GoogleIcon from '../../../../../images/googleLogo.svg';
import MicrosoftLogo from '../../../../../images/microsoftLogo.svg';
import { connect } from '../../../base/redux';
import { signOut, bootstrapCalendarIntegration, googleSignIn } from '../../actions/calendarSync';

import StyledPaper from './../StyledPaper';

const useStyles = makeStyles(() => {
    return {
        button: {
            width: '245px',
            marginTop: '15px'
        },
        subtitle: {
            color: '#ffffff',
            fontWeight: '700',
            fontSize: '1rem',
            marginTop: '10px',
            marginBottom: '10px'
        },
        boldText: {
            fontWeight: 600
        }
    };
});

const Settings = ({
    isConnectedToGoogleCalendar,
    googleProfileEmail,
    googleSignOut,
    bootstrapGoogleCalendarIntegration,
    googleCalendarSignIn,
    isConnectedToMsCalendar,
    msProfileEmail }) => {

    const classes = useStyles();

    const onClickSignInGoogle = () => googleCalendarSignIn();
    const onClickDisconnectGoogle = () => googleSignOut();
    const onClickSignInMicrosoft = () => {};
    const onClickDisconnectMicrosoft = () => {};

    useEffect(() => {
        bootstrapGoogleCalendarIntegration();
    }, []);


    return (
        <Grid
            container = { true }
            spacing = { 3 }>
            <Grid
                container = { true }
                item = { true }
                justify = 'flex-end'
                xs = { 12 } />
            <Grid
                item = { true }
                xs = { 12 }>
                <StyledPaper title = 'Settings' >
                    <Grid
                        alignItems = 'center'
                        container = { true }
                        item = { true }
                        spacing = { 4 }
                        xs = { 12 } >
                        <Grid
                            container = { true }
                            direction = 'column'
                            item = { true }
                            justify = 'center'>
                            <Typography
                                className = { classes.subtitle }>
                                Calendar Sync
                            </Typography>
                            <Typography>
                                Schedule and manage your calendars events from {interfaceConfig.APP_NAME}
                            </Typography>
                            <Typography
                                color = 'textSecondary'
                                variant = 'body2'>
                                The {interfaceConfig.APP_NAME} calendar integration is used to securely access your calendar.
                            </Typography>
                        </Grid>
                        <Grid
                            container = { true }
                            direction = 'column'
                            item = { true }
                            justify = 'flex-start'>
                            {isConnectedToGoogleCalendar
                                ? <Grid
                                    item = { true }>
                                    <Typography>
                                    Currently accessing calendar for
                                        <Box
                                            className = { classes.boldText }
                                            display = 'inline'>
                                            {` ${googleProfileEmail}`}
                                        </Box>
                                    </Typography>
                                    <Typography
                                        color = 'textSecondary'
                                        variant = 'body2'>
                                        Click the Disconnect button below to stop accessing calendar
                                    </Typography>
                                    <Button
                                        className = { classes.button }
                                        color = 'default'
                                        onClick = { onClickDisconnectGoogle }
                                        startIcon = { <Icon><GoogleIcon /></Icon> }
                                        variant = 'contained'> Disconnect </Button>
                                </Grid> : <Grid
                                    item = { true }>
                                    <Typography>
                                        Connect to the Google Calendar
                                    </Typography>
                                    <Button
                                        className = { classes.button }
                                        color = 'default'
                                        onClick = { onClickSignInGoogle }
                                        startIcon = { <Icon><GoogleIcon /></Icon> }
                                        variant = 'contained'> Sign in with Google</Button>
                                </Grid>}
                        </Grid>
                        <Grid
                            container = { true }
                            direction = 'column'
                            item = { true }
                            justify = 'flex-start'>
                            {isConnectedToMsCalendar
                                ? <Grid
                                    item = { true }>
                                    <Typography>
                                    Currently accessing calendar for
                                        <Box
                                            className = { classes.boldText }
                                            display = 'inline'>
                                            {` ${msProfileEmail}`}
                                        </Box>
                                    </Typography>
                                    <Typography
                                        color = 'textSecondary'
                                        variant = 'body2'>
                                        Click the Disconnect button below to stop accessing calendar
                                    </Typography>
                                    <Button
                                        className = { classes.button }
                                        color = 'default'
                                        onClick = { onClickDisconnectMicrosoft }
                                        startIcon = { <Icon><GoogleIcon /></Icon> }
                                        variant = 'contained'> Disconnect </Button>
                                </Grid> : <Grid
                                    item = { true }>
                                    <Typography>
                                    Connect to the Outlook Calendar
                                    </Typography>
                                    <Button
                                        className = { classes.button }
                                        color = 'default'
                                        onClick = { onClickSignInMicrosoft }
                                        startIcon = { <Icon><MicrosoftLogo /></Icon> }
                                        variant = 'contained'>Sign in with Microsoft</Button>
                                </Grid>}
                        </Grid>
                    </Grid>
                </StyledPaper>
            </Grid>
        </Grid>
    );
};

Settings.propTypes = {
    bootstrapGoogleCalendarIntegration: PropTypes.func,
    googleCalendarSignIn: PropTypes.func,
    googleProfileEmail: PropTypes.string,
    googleSignOut: PropTypes.func,
    isConnectedToGoogleCalendar: PropTypes.bool
};

const mapStateToProps = state => {
    const googleCalendarState = state['features/riff-platform'].calendarSync.google || {};

    return {
        isConnectedToGoogleCalendar: googleCalendarState.integrationReady,
        googleProfileEmail: googleCalendarState.profileEmail

    };
};

const mapDispatchToProps = dispatch => {
    return {
        googleSignOut: () => dispatch(signOut()),
        bootstrapGoogleCalendarIntegration: () => dispatch(bootstrapCalendarIntegration()),
        googleCalendarSignIn: () => dispatch(googleSignIn())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
