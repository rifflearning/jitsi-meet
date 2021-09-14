/* eslint-disable require-jsdoc */
/* eslint-disable react/jsx-no-bind */
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import StyledPaper from '../StyledPaper';

import CreatePersonalMeeting from './CreatePersonalMeeting';
import EditPersonalMeeting from './EditPersonalMeeting';
import NoPersonalMeeting from './NoPersonalMeeting';
import PersonalMeetingDetails from './PersonalMeetingDetails';

function PersonalMeeting({
    meeting = {},
    loading
}) {

    const [ isEditing, setIsEditing ] = useState(false);
    const [ isCreating, setIsCreating ] = useState(false);

    const handleEditClick = () => setIsEditing(true);

    const handleCreateClick = () => setIsCreating(true);

    const onFinishEdit = () => setIsEditing(false);

    const onFinishCreate = () => setIsCreating(false);

    return (
        meeting._id
            ? isEditing
                ? <EditPersonalMeeting
                    meeting = { meeting }
                    onCancelEdit = { onFinishEdit }
                    onSuccessEdit = { onFinishEdit } />
                : <StyledPaper>
                    <PersonalMeetingDetails
                        handleEditClick = { handleEditClick }
                        loading = { loading }
                        meeting = { meeting } />
                </StyledPaper>
            : isCreating
                ? <CreatePersonalMeeting
                    onCancelCreate = { onFinishCreate }
                    onSuccessCreate = { onFinishCreate } />
                : <StyledPaper>
                    <NoPersonalMeeting handleCreateRoom = { handleCreateClick } />
                </StyledPaper>
    );
}

PersonalMeeting.propTypes = {
    loading: PropTypes.bool,
    meeting: PropTypes.object
};

export default PersonalMeeting;
