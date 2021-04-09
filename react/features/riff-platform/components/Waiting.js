/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-sort-props */

import { CircularProgress, Grid } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { connect } from '../../base/redux';
import { checkIsMeetingAllowed } from '../actions/meeting';
import * as errorTypes from '../constants/errorTypes';
import * as ROUTES from '../constants/routes';
import { msToTime } from '../functions';


const useStyles = makeStyles(theme => {
    return {
        paper: {
            marginTop: theme.spacing(4),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        },
        avatar: {
            margin: theme.spacing(1),
            backgroundColor: theme.palette.secondary.main
        },
        form: {
            width: '100%', // Fix IE 11 issue.
            marginTop: theme.spacing(1)
        },
        submit: {
            margin: theme.spacing(3, 0, 2)
        },
        textWhite: {
            color: '#ffffff'
        },
        timeText: {
            fontWeight: 700,
            fontSize: '1.5rem'
        }
    };
});

const Waiting = ({ meeting, checkIsMeetingAllowedProp }) => {
    const classes = useStyles();
    const history = useHistory();
    const params = useParams();
    let interval;

    const [ waitingTime, setWaitingTime ] = useState(false);
    const [ noHostError, setNoHostError ] = useState(false);
    const [ expiredMeetingError, setExpiredMeetingError ] = useState(false);

    const redirectToMeeting = () => {
        // Need to reload page
        window.location.replace(`/${params.meetingId}`);
    };

    const waitForMeeting = m => {
        setWaitingTime(Math.round((new Date(m.dateStart) - Date.now() - (5 * 60 * 1000)) / 1000));

        interval = setInterval(() => {
            setWaitingTime(prev => {
                if (prev === 0) {
                    clearInterval(interval);
                    // eslint-disable-next-line no-use-before-define
                    checkMeeting();

                    return false;
                }

                return prev - 1;
            });
        }, 1000);
    };

    const waitForHost = () => {
        setNoHostError(true);
        interval = setTimeout(() => {
            // eslint-disable-next-line no-use-before-define
            checkMeeting();
        }, 10000);
    };

    const checkMeeting = () => {
        checkIsMeetingAllowedProp(params.meetingId).then(res => {
            switch (res.error) {
            case errorTypes.NO_MEETING:
                return history.push(ROUTES.JOIN);
            case errorTypes.NOT_A_MEETING_TIME:
                return waitForMeeting(res.meeting);
            case errorTypes.NO_HOST_ERROR:
                return waitForHost(res.meeting);
            case errorTypes.NOT_JOIN_NEW_USER_TO_ENDED_MEETING:
                return setExpiredMeetingError(true);
            default:
                setNoHostError(false);

                return redirectToMeeting();
            }
        });
    };

    useEffect(() => {
        checkMeeting();

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, []);

    const loader = (<Grid
        container
        item
        justify = 'center'
        xs = { 12 }><CircularProgress /></Grid>);

    if (!meeting) {
        return loader;
    }

    const time = msToTime(waitingTime * 1000);

    return (
        <Container
            component = 'main'
            maxWidth = 'xs'>
            <div className = { classes.paper }>
                <Typography
                    component = 'h1'
                    variant = 'h4' >
                    Waiting Room
                </Typography>
                <br />
                {Boolean(waitingTime) && meeting.dateStart
                    ? <Typography
                        align = 'center'
                        component = 'p'
                        color = 'textPrimary'
                        variant = 'subtitle1'>
                        {`Meeting is scheduled for ${(new Date(meeting.dateStart)).toString()
                            .slice(0, 24)}`}
                    </Typography>
                    : expiredMeetingError ? null : <Typography
                        component = 'p'
                        className = { classes.textWhite }
                        variant = 'h5'
                        gutterBottom = { true } >
                        Redirecting to the meeting...
                    </Typography>
                }

                {/* host will be able to edit meeting, can go to meeting directly, can send invitation?' */}
                {Boolean(waitingTime) && (
                    <>
                        <Typography
                            align = 'center'
                            color = 'textPrimary'>
                            You can join the meeting 5 min before the start. You'll be able to join in
                        </Typography>
                        <Typography
                            color = 'textPrimary'
                            className = { classes.timeText }>
                            {time}
                        </Typography>
                </>
                )}
                <Typography color = 'textPrimary'>
                    {Boolean(noHostError) && 'Waiting for the host...'}
                    {Boolean(expiredMeetingError) && 'Meeting is expired. Please, join another meeting.'}
                </Typography>
            </div>
        </Container>
    );
};

Waiting.propTypes = {
    checkIsMeetingAllowedProp: PropTypes.func,
    meeting: PropTypes.object
};

const mapStateToProps = state => {
    return {
        meeting: state['features/riff-platform'].meeting.meeting
    };
};

const mapDispatchToProps = dispatch => {
    return {
        checkIsMeetingAllowedProp: meetingId => dispatch(checkIsMeetingAllowed(meetingId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Waiting);
