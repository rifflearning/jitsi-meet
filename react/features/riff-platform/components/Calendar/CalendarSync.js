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
    bootstrapGoogleCalendarIntegration,
    googleSignIn,
    bootstrapMsCalendarIntegration,
    microsoftSignIn,
    microsoftSignOut
} from '../../actions/calendarSync';
import { isGoogleCalendarEnabled, isMsCalendarEnabled } from '../../calendarSyncFunctions';
import { CALENDARS } from '../../constants/calendarSync';
import StyledPaper from '../StyledPaper';

const useStyles = makeStyles(() => {
    return {
        googleButton: {
            backgroundColor: '#ffffff',
            color: 'rgba(0, 0, 0, 0.60)',
            borderRadius: '2px',
            fontFamily: 'Roboto, arial, sans-serif',
            fontSize: '14px',
            fontWeight: 600,
            lineHeight: '32px',
            textTransform: 'none',
            padding: '1px',
            width: '223px',
            height: '41px',
            marginTop: '15px',

            '& .material-icons': {
                margin: '8px',
                height: '18px',
                width: '18px'
            }
        },
        msButton: {
            backgroundColor: '#ffffff',
            color: 'rgba(0, 0, 0, 0.60)',
            border: '1px #8c8c8c',
            boxSizing: 'border-box',
            fontFamily: 'Segoe UI, arial, sans-serif',
            fontSize: '15px',
            fontWeight: 600,
            lineHeight: '41px',
            textTransform: 'none',
            padding: '12px',
            height: '41px',
            width: '223px',
            marginTop: '15px',

            '& .MuiButton-startIcon-121': {
                margin: '0',
                display: 'inline-block',
                width: '21px',
                height: '21px',
                marginRight: '12px'
            }
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

const CalendarSync = ({
    isConnectedToGoogleCalendar,
    googleProfileEmail,
    googleCalendarSignOut,
    bootstrapCalendarIntegrationGoogle,
    googleCalendarSignIn,
    isConnectedToMsCalendar,
    bootstrapCalendarIntegrationMs,
    msCalendarSignIn,
    msSignOut,
    msProfileEmail }) => {


    const classes = useStyles();

    const isGoogleCalendarIntegrationEnabled = isGoogleCalendarEnabled();
    const isMsCalendarIntegartionEnabled = isMsCalendarEnabled();

    const onClickSign = calendar => {
        if (calendar === CALENDARS.GOOGLE) {
            return googleCalendarSignIn();
        } else if (calendar === CALENDARS.MS) {
            msCalendarSignIn();
        }
    };
    const onClickDisconnectGoogle = () => googleCalendarSignOut();
    const onClickDisconnectMicrosoft = () => msSignOut();

    useEffect(() => {
        isGoogleCalendarIntegrationEnabled && bootstrapCalendarIntegrationGoogle();
        isMsCalendarIntegartionEnabled && bootstrapCalendarIntegrationMs();
    }, []);

    return (
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
                        Schedule your calendars events from {interfaceConfig.APP_NAME}
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
                                        className = { classes.googleButton }
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
                                        className = { classes.googleButton }
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
                                        className = { classes.msButton }
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
                                        className = { classes.msButton }
                                        color = 'default'
                                        onClick = { () => onClickSign(CALENDARS.MS) }
                                        startIcon = { <Icon><MicrosoftLogo /></Icon> }
                                        variant = 'contained'>Sign in with Microsoft</Button>
                                </Grid>}
                        </Grid>
                }
            </Grid>
        </StyledPaper>
    );
};

CalendarSync.propTypes = {
    bootstrapCalendarIntegrationGoogle: PropTypes.func,
    bootstrapCalendarIntegrationMs: PropTypes.func,
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
        bootstrapCalendarIntegrationGoogle: () => dispatch(bootstrapGoogleCalendarIntegration()),
        googleCalendarSignIn: () => dispatch(googleSignIn()),
        bootstrapCalendarIntegrationMs: () => dispatch(bootstrapMsCalendarIntegration()),
        msCalendarSignIn: () => dispatch(microsoftSignIn()),
        msSignOut: () => dispatch(microsoftSignOut())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CalendarSync);
