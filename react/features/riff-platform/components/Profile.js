/* eslint-disable react/jsx-no-bind */
/* eslint-disable react-native/no-color-literals */
/* eslint-disable react/no-multi-comp */
/* eslint-disable react-native/no-inline-styles */
import { Button, Grid, Box, makeStyles, Tabs, Tab } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import { connect } from '../../base/redux';
import { getMeetings } from '../actions/meetings';
import { getUserPersonalMeetingRoom } from '../actions/personalMeeting';
import { logout } from '../actions/signIn';
import * as LIST_TYPES from '../constants/meetingsListTypes';
import { groupMeetingsByDays } from '../functions';

import CalendarSync from './Calendar/CalendarSync';
import MeetingsTable from './Meetings/MeetingsTable';
import UserPersonalMeetingRoom from './PersonalMeetingRoom/PersonalMeeting';
import StyledPaper from './StyledPaper';

const useStyles = makeStyles(() => {
    return {
        tab: {
            color: '#ffffff'
        }
    };
});

const ProfileTabPanel = ({ children, value, index }) => (
    <div
        aria-labelledby = { `profile-tab-${index}` }
        hidden = { value !== index }
        id = { `profile-tabpanel-${index}` }
        style = {{ color: '#ffffff',
            width: '100%' }}>
        {value === index && (
            <Box pt = { 2 }>
                {children}
            </Box>
        )}
    </div>
);

ProfileTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
};


const UserProfile = ({
    doLogout,
    profileInfo,
    meetingsLists = [],
    getMeetingsLists,
    isAnon,
    personalMeeting = {},
    fetchPersonalMeeting
}) => {
    const [ selectedTab, setSeletedTab ] = useState(0);

    const classes = useStyles();

    useEffect(() => {
        getMeetingsLists();
        fetchPersonalMeeting();
    }, []);

    const groupedMeetings = groupMeetingsByDays(meetingsLists);

    // eslint-disable-next-line max-len
    const noMeetingDataText = 'The user doesn`t have any upcoming meetings today. To schedule a new meeting click SCHEDULE A MEETING';

    return (
        <Grid
            container = { true }
            spacing = { 3 }>
            <Grid
                item = { true }
                xs = { 12 }>
                <Grid
                    alignItems = 'center'
                    container = { true }
                    item = { true }
                    justify = 'space-between'
                    xs = { 12 }>
                    <Grid
                        item = { true }>
                        <Box pb = { 1 }>
                            <Tabs
                                onChange = { (_event, type) =>
                                    setSeletedTab(type) }
                                value = { selectedTab }>
                                <Tab
                                    className = { classes.tab }
                                    label = 'Main Info' />
                                <Tab
                                    className = { classes.tab }
                                    label = 'Calendar Sync' />
                            </Tabs>
                        </Box>
                    </Grid>
                    <Grid item = { true }>
                        <Button
                            color = 'primary'
                            onClick = { doLogout }
                            variant = 'outlined'>{isAnon ? 'Register' : 'Logout'}
                        </Button>
                    </Grid>
                </Grid>
                <Grid
                    container = { true }
                    item = { true }
                    justify = 'center'>
                    <ProfileTabPanel
                        index = { 0 }
                        value = { selectedTab }>
                        <Grid
                            container = { true }
                            spacing = { 3 }>
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
                            {personalMeeting?._id
                && <Grid
                    item = { true }
                    xs = { 12 }>
                    <StyledPaper title = 'Personal Meeting Room'>
                        <UserPersonalMeetingRoom
                            meeting = { personalMeeting } />
                    </StyledPaper>
                </Grid>
                            }
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
                    </ProfileTabPanel>
                    <ProfileTabPanel
                        index = { 1 }
                        value = { selectedTab } >
                        <CalendarSync />
                    </ProfileTabPanel>
                </Grid>
            </Grid>
        </Grid>
    );
};

UserProfile.propTypes = {
    doLogout: PropTypes.func,
    fetchPersonalMeeting: PropTypes.func,
    getMeetingsLists: PropTypes.func,
    isAnon: PropTypes.bool,
    meetingsLists: PropTypes.array,
    personalMeeting: PropTypes.object,
    profileInfo: PropTypes.object
};

const mapStateToProps = state => {
    return {
        isAnon: Boolean(state['features/riff-platform'].signIn.user?.isAnon),
        profileInfo: state['features/riff-platform'].signIn.user,
        meetingsLists: state['features/riff-platform'].meetings.meetingsLists,
        personalMeeting: state['features/riff-platform'].personalMeeting.meeting
    };
};

const mapDispatchToProps = dispatch => {
    return {
        doLogout: obj => dispatch(logout(obj)),
        getMeetingsLists: () => dispatch(getMeetings(LIST_TYPES.UPCOMING)),
        fetchPersonalMeeting: () => dispatch(getUserPersonalMeetingRoom())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
