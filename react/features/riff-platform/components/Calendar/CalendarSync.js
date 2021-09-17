/* eslint-disable max-len */
/* eslint-disable react/jsx-no-bind */
/* global interfaceConfig */
import { Button, Grid, Typography, makeStyles, Box } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

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
import { isGoogleCalendarEnabled, isMsCalendarEnabled } from '../../calendarSyncFunctions';
import StyledPaper from '../StyledPaper';

import TrustDialog from './TrustDialog';

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
            margin: '20px 0 20px 0',
            padding: '15px',
            backgroundColor: '#555555',
            borderRadius: '4px',
            boxShadow: '5px 5px 9px -5px rgba(0, 0, 0, 0.37)'

        }
    };
});

const CALENDARS = {
    GOOGLE: 'google',
    MS: 'ms'
};

const CalendarSync = ({
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

    const [ isOpenTrustDialg, setIsOpenTrustDialog ] = useState(false);
    const [ selectedCalendar, setSelectedCalendar ] = useState(CALENDARS.GOOGLE);

    const classes = useStyles();

    const isGoogleCalendarIntegrationEnabled = isGoogleCalendarEnabled();
    const isMsCalendarIntegartionEnabled = isMsCalendarEnabled();

    const onClickSign = calendar => {
        setSelectedCalendar(calendar);
        setIsOpenTrustDialog(true);
    };
    const onClickDisconnectGoogle = () => googleCalendarSignOut();
    const onClickDisconnectMicrosoft = () => msSignOut();

    useEffect(() => {
        bootstrapGoogleCalendarIntegration();
        bootstrapMicrosftCalendarIntegration();
    }, []);

    const handleCloseDialog = () => {
        setIsOpenTrustDialog(false);
    };

    const handleContinueSingIn = () => {
        setIsOpenTrustDialog(false);
        if (selectedCalendar === CALENDARS.GOOGLE) {
            return googleCalendarSignIn();
        } else if (selectedCalendar === CALENDARS.MS) {
            msCalendarSignIn();
        }
    };

    window.onbeforeunload = function() {
        const clearStorageAfterSessionFinished = sessionStorage.getItem('clearStorage') === 'true';

        if (clearStorageAfterSessionFinished) {
            googleCalendarSignOut();
            msSignOut();
        }
    };

    return (
        <>
            <StyledPaper>
                <Grid
                    alignItems = 'center'
                    container = { true }
                    item = { true }
                    xs = { 12 } >
                    <Grid
                        container = { true }
                        direction = 'column'
                        item = { true }
                        justify = 'center'>
                        <Typography>
                            Schedule and manage your calendars events from {interfaceConfig.APP_NAME}
                        </Typography>
                        <Typography
                            color = 'textSecondary'
                            variant = 'body2'>
                            The {interfaceConfig.APP_NAME} calendar integration is used to securely access your calendar
                        </Typography>
                    </Grid>
                    {isGoogleCalendarIntegrationEnabled
                        && <Grid
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
                                        onClick = { () => onClickSign(CALENDARS.GOOGLE) }
                                        startIcon = { <Icon><GoogleIcon /></Icon> }
                                        variant = 'contained'> Sign in with Google</Button>
                                </Grid>}
                        </Grid>
                    }
                    {isMsCalendarIntegartionEnabled
                        && <Grid
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
                                        onClick = { () => onClickSign(CALENDARS.MS) }
                                        startIcon = { <Icon><MicrosoftLogo /></Icon> }
                                        variant = 'contained'>Sign in with Microsoft</Button>
                                </Grid>}
                        </Grid>
                    }
                </Grid>
            </StyledPaper>
            {isOpenTrustDialg
                && <TrustDialog
                    handleCancel = { handleCloseDialog }
                    handleContinue = { handleContinueSingIn }
                    isOpen = { isOpenTrustDialg } />
            }
        </>
    );
};

CalendarSync.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(CalendarSync);
