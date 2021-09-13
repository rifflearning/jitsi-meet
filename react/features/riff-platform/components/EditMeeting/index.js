/* eslint-disable require-jsdoc */
/* eslint-disable react/no-multi-comp */
/* eslint-disable react/jsx-no-bind */

import { Grid, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';

import { connect } from '../../../base/redux';
import { getMeetingById, meetingReset } from '../../actions/meeting';
import * as ROUTES from '../../constants/routes';
import Loader from '../Loader';
import EditPesonalMeeting from '../PersonalMeetingRoom/EditPersonalMeeting';
import SchedulerForm from '../Scheduler/SchedulerForm';
import StyledPaper from '../StyledPaper';

const errorMessage = err => (<Grid
    container = { true }
    item = { true }
    justify = 'center'
    xs = { 12 }><Typography color = 'error'>{err}</Typography></Grid>);


const EditMeeting = ({ resetMeeting, fetchMeetingById, meetingError, meetingLoading, meeting }) => {
    useEffect(() => () => resetMeeting(), []);

    const { meetingId } = useParams();
    const history = useHistory();

    useEffect(() => {
        fetchMeetingById(meetingId);
    }, [ meetingId ]);

    if (meetingError) {
        return errorMessage(meetingError);
    }

    if (meetingLoading) {
        return <Loader />;
    }

    const onSuccessEdit = () => history.push(`${ROUTES.MEETINGS}/${meetingId}`);

    return (
        <Grid
            container = { true }
            spacing = { 3 }>
            <Grid
                item = { true }
                xs = { 12 }>
                {meeting?.isPersonal
                    ? <EditPesonalMeeting
                        meeting = { meeting }
                        onCancelEdit = { onSuccessEdit }
                        onSuccessEdit = { onSuccessEdit } />
                    : <StyledPaper title = 'Edit a meeting'>
                        <SchedulerForm
                            isEditing = { true }
                            meeting = { meeting } />
                    </StyledPaper>
                }
            </Grid>
        </Grid>
    );
};

EditMeeting.propTypes = {
    fetchMeetingById: PropTypes.func,
    meeting: PropTypes.object,
    meetingError: PropTypes.string,
    meetingLoading: PropTypes.bool,
    resetMeeting: PropTypes.func
};

const mapStateToProps = state => {
    return {
        meetingError: state['features/riff-platform'].meeting.error,
        meetingLoading: state['features/riff-platform'].meeting.loading,
        meeting: state['features/riff-platform'].meeting.meeting
    };
};
const mapDispatchToProps = dispatch => {
    return {
        fetchMeetingById: id => dispatch(getMeetingById(id)),
        resetMeeting: () => dispatch(meetingReset())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditMeeting);
