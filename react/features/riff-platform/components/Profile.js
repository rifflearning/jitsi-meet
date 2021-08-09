import { Button, Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

import { connect } from '../../base/redux';
import { getMeetings } from '../actions/meetings';
import { logout } from '../actions/signIn';
import { groupMeetingsByDays } from '../functions';

import MeetingsTable from './Meetings/MeetingsTable';
import StyledPaper from './StyledPaper';

const App = ({ doLogout, profileInfo, meetingsLists = [], getMeetingsLists, isAnon }) => {
    useEffect(() => {
        getMeetingsLists();
    }, []);

    const groupedMeetings = groupMeetingsByDays(meetingsLists);

    // eslint-disable-next-line max-len
    const noMeetingDataText = 'The user doesn`t have any upcoming meetings today. To schedule a new meeting click SCHEDULE A MEETING';

    return (
        <Grid
            container = { true }
            spacing = { 3 }>
            <Grid
                container = { true }
                item = { true }
                justify = 'flex-end'
                xs = { 12 }>
                <Button
                    color = 'primary'
                    onClick = { doLogout }
                    variant = 'outlined'>{isAnon ? 'Register' : 'Logout'}</Button>
            </Grid>
            <Grid
                item = { true }
                xs = { 12 }>
                <StyledPaper title = 'User Information:'>
                    {profileInfo
                        ? <>{`Name: ${profileInfo?.displayName}`} <br />
                            {`Email: ${profileInfo?.email}`}</>
                        : 'loading...'
                    }
                </StyledPaper>

            </Grid>
            <Grid
                item = { true }
                xs = { 12 }>
                <StyledPaper title = 'Meetings for today:'>
                    {groupedMeetings.Today?.length
                        ? <MeetingsTable
                            meetingsList = { groupedMeetings.Today } />
                        : noMeetingDataText
                    }
                </StyledPaper>
            </Grid>
        </Grid>
    );
};

App.propTypes = {
    doLogout: PropTypes.func,
    getMeetingsLists: PropTypes.func,
    isAnon: PropTypes.bool,
    meetingsLists: PropTypes.array,
    profileInfo: PropTypes.object
};

const mapStateToProps = state => {
    return {
        isAnon: Boolean(state['features/riff-platform'].signIn.user?.isAnon),
        profileInfo: state['features/riff-platform'].signIn.user,
        meetingsLists: state['features/riff-platform'].meetings.meetingsLists
    };
};

const mapDispatchToProps = dispatch => {
    return {
        doLogout: obj => dispatch(logout(obj)),
        getMeetingsLists: () => dispatch(getMeetings('upcoming'))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
