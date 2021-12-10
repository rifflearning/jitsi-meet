/* eslint-disable require-jsdoc */
/* eslint-disable react/jsx-no-bind */
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import { connect } from '../../../base/redux';
import { getUserPersonalMeetingRoom } from '../../actions/personalMeeting';
import Loader from '../Loader';
import MeetingDetails from '../Meeting/Meeting';
import StyledPaper from '../StyledPaper';

import CreatePersonalMeeting from './CreatePersonalMeeting';
import EditPersonalMeeting from './EditPersonalMeeting';
import NoPersonalMeeting from './NoPersonalMeeting';

function PersonalMeeting({
    meeting = {},
    fetchPersonalMeeting,
    loading
}) {

    const [ isEditing, setIsEditing ] = useState(false);
    const [ isCreating, setIsCreating ] = useState(false);

    useEffect(() => {
        if (!meeting._id) {
            fetchPersonalMeeting();
        }
    }, [ meeting ]);

    if (loading) {
        return <Loader />;
    }

    const handleEditClick = () => setIsEditing(true);

    const handleCreateClick = () => setIsCreating(true);

    const onFinishEdit = () => setIsEditing(false);

    const onFinishCreate = () => setIsCreating(false);

    return (
        meeting._id
            ? isEditing
                ? <StyledPaper title = 'Edit Personal Meeting Room'>
                    <EditPersonalMeeting
                        meeting = { meeting }
                        onCancelEdit = { onFinishEdit }
                        onSuccessEdit = { onFinishEdit } />
                </StyledPaper>
                : <StyledPaper>
                    <MeetingDetails
                        meeting = { meeting }
                        onEditClick = { handleEditClick } />
                </StyledPaper>
            : isCreating
                ? <StyledPaper title = 'Create Personal Meeting Room'>
                    <CreatePersonalMeeting
                        onCancelCreate = { onFinishCreate }
                        onSuccessCreate = { onFinishCreate } />
                </StyledPaper>
                : <StyledPaper>
                    <NoPersonalMeeting handleCreateRoom = { handleCreateClick } />
                </StyledPaper>
    );
}

PersonalMeeting.propTypes = {
    fetchPersonalMeeting: PropTypes.func,
    loading: PropTypes.bool,
    meeting: PropTypes.object,
    resetMeeting: PropTypes.func
};

const mapStateToProps = state => {
    return {
        meeting: state['features/riff-platform'].personalMeeting.meeting,
        loading: state['features/riff-platform'].personalMeeting.loading
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchPersonalMeeting: () => dispatch(getUserPersonalMeetingRoom())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PersonalMeeting);
