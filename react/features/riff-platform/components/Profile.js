import { Button, Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

import { connect } from '../../base/redux';
import { getMeetings } from '../actions/meetings';
import { getUserPersonalMeetingRoom } from '../actions/personalMeeting';
import { logout } from '../actions/signIn';
import { groupMeetingsByDays } from '../functions';

import UserPersonalMeetingRoom from './Meeting/PersonalMeeting';
import MeetingsTable from './Meetings/MeetingsTable';
import StyledPaper from './StyledPaper';

const UserProfile = ({
    doLogout,
    profileInfo,
    meetingsLists = [],
    getMeetingsLists,
    isAnon,
    personalRoom = {},
    fetchPersonalRoom
}) => {
    useEffect(() => {
        getMeetingsLists();
        if (!personalRoom._id && profileInfo?.pmrId) {
            fetchPersonalRoom(profileInfo.pmrId);
        }
    }, []);

    const groupedMeetings = groupMeetingsByDays(meetingsLists);

    // eslint-disable-next-line max-len
    const noMeetingDataText = 'The user doesn`t have any upcoming meetings today. To schedule a new meeting click SCHEDULE A MEETING';
    const noPersonalRoom = 'The user doesn`t have personal meeting room';

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
                {personalRoom._id
                    ? <UserPersonalMeetingRoom
                        meeting = { personalRoom }
                        showDetailsEnabled = { true }
                        title = 'Personal Room' />
                    : noPersonalRoom}
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

UserProfile.propTypes = {
    doLogout: PropTypes.func,
    fetchPersonalRoom: PropTypes.func,
    getMeetingsLists: PropTypes.func,
    isAnon: PropTypes.bool,
    meetingsLists: PropTypes.array,
    personalRoom: PropTypes.object,
    profileInfo: PropTypes.object
};

const mapStateToProps = state => {
    return {
        isAnon: Boolean(state['features/riff-platform'].signIn.user?.isAnon),
        profileInfo: state['features/riff-platform'].signIn.user,
        meetingsLists: state['features/riff-platform'].meetings.meetingsLists,
        personalRoom: state['features/riff-platform'].personalMeeting.meeting
    };
};

const mapDispatchToProps = dispatch => {
    return {
        doLogout: obj => dispatch(logout(obj)),
        getMeetingsLists: () => dispatch(getMeetings('upcoming')),
        fetchPersonalRoom: id => dispatch(getUserPersonalMeetingRoom(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
