/* eslint-disable require-jsdoc */
/* eslint-disable react/no-multi-comp */
/* eslint-disable react/jsx-no-bind */

import { Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';

import { connect } from '../../../base/redux';
import { getMeetingById, meetingReset } from '../../actions/meeting';
import * as ROUTES from '../../constants/routes';
import PersonalMeeting from '../PersonalMeetingRoom/PersonalMeetingDetails';
import StyledPaper from '../StyledPaper';

import Meeting from './Meeting';

function MeetingDetails({
    meeting = {},
    fetchMeeting,
    resetMeeting,
    loading,
    error
}) {
    const history = useHistory();
    const { meetingId } = useParams();
    const roomNumber = meetingId?.split('-')[1];

    useEffect(() => () => resetMeeting(), []);

    useEffect(() => {
        if (meetingId) {
            fetchMeeting(meetingId);
        }
    }, [ meetingId ]);

    const handleEditClick = () => history.push(`${ROUTES.MEETINGS}/${meeting._id}/edit`);

    return (
        <Grid
            container = { true }
            spacing = { 3 }>
            <Grid
                item = { true }
                xs = { 12 }>
                <StyledPaper title = 'Meeting information'>
                    {meeting?.isPersonal
                        ? <PersonalMeeting
                            error = { error }
                            handleEditClick = { handleEditClick }
                            loading = { loading }
                            meeting = { meeting } />
                        : <Meeting
                            error = { error }
                            loading = { loading }
                            meeting = { meeting }
                            roomNumber = { roomNumber } />
                    }
                </StyledPaper>
            </Grid>
        </Grid>
    );
}

MeetingDetails.propTypes = {
    error: PropTypes.string,
    fetchMeeting: PropTypes.func,
    loading: PropTypes.bool,
    meeting: PropTypes.object,
    resetMeeting: PropTypes.func
};

const mapStateToProps = state => {
    return {
        loading: state['features/riff-platform'].meeting.loading,
        meeting: state['features/riff-platform'].meeting.meeting,
        error: state['features/riff-platform'].meeting.error
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchMeeting: id => dispatch(getMeetingById(id)),
        resetMeeting: () => dispatch(meetingReset())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MeetingDetails);
