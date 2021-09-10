/* eslint-disable require-jsdoc */
/* eslint-disable react/no-multi-comp */
/* eslint-disable react/jsx-no-bind */

import { Grid, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

import { connect } from '../../../base/redux';
import { getUserPersonalMeetingRoom } from '../../actions/personalMeeting';
import Loader from '../Loader';
import StyledPaper from '../StyledPaper';

import PersonalMeetingForm from './PersonalMeetingForm';

const errorMessage = err => (<Grid
    container = { true }
    item = { true }
    justify = 'center'
    xs = { 12 }><Typography color = 'error'>{err}</Typography></Grid>);


const EditMeeting = ({ fetchPersonalMeeting, meetingError, meetingLoading, meeting }) => {

    useEffect(() => {
        if (!meeting?._id) {
            fetchPersonalMeeting();
        }
    }, [ meeting ]);


    if (meetingError) {
        return errorMessage(meetingError);
    }

    if (meetingLoading) {
        return <Loader />;
    }

    return (
        <Grid
            container = { true }
            spacing = { 3 }>
            <Grid
                item = { true }
                xs = { 12 }>
                <StyledPaper title = 'Create personal meeting room'>
                    <PersonalMeetingForm
                        isEditing = { false }
                        meeting = { meeting } />
                </StyledPaper>
            </Grid>
        </Grid>
    );
};

EditMeeting.propTypes = {
    fetchPersonalMeeting: PropTypes.func,
    meeting: PropTypes.object,
    meetingError: PropTypes.string,
    meetingLoading: PropTypes.bool
};

const mapStateToProps = state => {
    return {
        meetingError: state['features/riff-platform'].personalMeeting.error,
        meetingLoading: state['features/riff-platform'].personalMeeting.loading,
        meeting: state['features/riff-platform'].personalMeeting.meeting
    };
};
const mapDispatchToProps = dispatch => {
    return {
        fetchMeetingById: () => dispatch(getUserPersonalMeetingRoom())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditMeeting);
