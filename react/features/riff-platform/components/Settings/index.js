/* eslint-disable max-len */
/* eslint-disable react/jsx-no-bind */
/* global interfaceConfig */
import { Button, Grid, Typography, makeStyles, Box } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

import GoogleIcon from '../../../../../images/googleLogo.svg';
import MicrosoftLogo from '../../../../../images/microsoftLogo.svg';
import { connect } from '../../../base/redux';
import {
    googleSignOut,
    bootstrapCalendarIntegration,
    googleSignIn,
    bootstrapMsCalendarIntegration,
    microsoftSignIn,
    microsoftSignOut
} from '../../actions/calendarSync';

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
        },
        textPrimary: {
            fontSize: '1rem'
        },
        box: {
            margin: '20px',
            padding: '16px',
            backgroundColor: '#555555',
            borderRadius: '4px',
            boxShadow: '5px 5px 9px -5px rgba(0, 0, 0, 0.37)'

        }
    };
});

const Settings = ({
    isConnectedToGoogleCalendar,
    googleProfileEmail,
    googleCalendarSignOut,
    bootstrapGoogleCalendarIntegration,
    googleCalendarSignIn,
    isConnectedToMsCalendar,
    bootstrapMicrosftCalendarIntegration,
    msCalendarSignIn,
    msSignOut,
    msProfileEmail }) => {

    const classes = useStyles();

    const onClickSignInGoogle = () => googleCalendarSignIn();
    const onClickDisconnectGoogle = () => googleCalendarSignOut();
    const onClickSignInMicrosoft = () => msCalendarSignIn();
    const onClickDisconnectMicrosoft = () => msSignOut();

    useEffect(() => {
        bootstrapGoogleCalendarIntegration();
        bootstrapMicrosftCalendarIntegration();
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
                        xs = { 12 } >
                        <Grid
                            className = { classes.box }
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
                            className = { classes.box }
                            container = { true }
                            direction = 'column'
                            item = { true }
                            justify = 'flex-start'>
                            {isConnectedToGoogleCalendar
                                ? <Grid
                                    item = { true }>
                                    <Box className = { classes.textPrimary }>
                                    Currently accessing Google Calendar for
                                        <Box
                                            className = { classes.boldText }
                                            display = 'inline'>
                                            {` ${googleProfileEmail}`}
                                        </Box>
                                    </Box>
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
                            className = { classes.box }
                            container = { true }
                            direction = 'column'
                            item = { true }
                            justify = 'flex-start'>
                            {isConnectedToMsCalendar
                                ? <Grid
                                    item = { true }>
                                    <Box className = { classes.textPrimary }>
                                    Currently accessing Outlook Calendar for
                                        <Box
                                            className = { classes.boldText }
                                            display = 'inline'>
                                            {` ${msProfileEmail}`}
                                        </Box>
                                    </Box>
                                    <Typography
                                        color = 'textSecondary'
                                        variant = 'body2'>
                                        Click the Disconnect button below to stop accessing calendar
                                    </Typography>
                                    <Button
                                        className = { classes.button }
                                        color = 'default'
                                        onClick = { onClickDisconnectMicrosoft }
                                        startIcon = { <Icon><MicrosoftLogo /></Icon> }
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
    bootstrapMicrosftCalendarIntegration: PropTypes.func,
    googleCalendarSignIn: PropTypes.func,
    googleCalendarSignOut: PropTypes.func,
    googleProfileEmail: PropTypes.string,
    isConnectedToGoogleCalendar: PropTypes.bool,
    isConnectedToMsCalendar: PropTypes.bool,
    msCalendarSignIn: PropTypes.func,
    msProfileEmail: PropTypes.string,
    msSignOut: PropTypes.func
};

const mapStateToProps = state => {
    const googleCalendarState = state['features/riff-platform'].calendarSync.google || {};
    const msCalendarState = state['features/riff-platform'].calendarSync.microsoft || {};

    return {
        isConnectedToGoogleCalendar: googleCalendarState.integrationReady,
        googleProfileEmail: googleCalendarState.profileEmail,
        isConnectedToMsCalendar: msCalendarState.integrationReady,
        msProfileEmail: msCalendarState.msAuthState.userSigninName
    };
};

const mapDispatchToProps = dispatch => {
    return {
        googleCalendarSignOut: () => dispatch(googleSignOut()),
        bootstrapGoogleCalendarIntegration: () => dispatch(bootstrapCalendarIntegration()),
        googleCalendarSignIn: () => dispatch(googleSignIn()),
        bootstrapMicrosftCalendarIntegration: () => dispatch(bootstrapMsCalendarIntegration()),
        msCalendarSignIn: () => dispatch(microsoftSignIn()),
        msSignOut: () => dispatch(microsoftSignOut())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
