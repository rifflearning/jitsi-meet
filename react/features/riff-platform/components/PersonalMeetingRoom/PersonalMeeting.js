/* eslint-disable require-jsdoc */
/* eslint-disable react/jsx-no-bind */
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import MeetingDetails from '../Meeting/Meeting';
import StyledPaper from '../StyledPaper';

import CreatePersonalMeeting from './CreatePersonalMeeting';
import EditPersonalMeeting from './EditPersonalMeeting';
import NoPersonalMeeting from './NoPersonalMeeting';

function PersonalMeeting({
    meeting = {},
    loading
}) {

    const [ isEditing, setIsEditing ] = useState(false);
    const [ isCreating, setIsCreating ] = useState(false);

    return (
        meeting._id
            ? isEditing
                ? <StyledPaper title = 'Edit Personal Meeting Room'>
                    <EditPersonalMeeting
                        meeting = { meeting }
                        onCancelEdit = { () => setIsEditing(false) }
                        onSuccessEdit = { () => setIsEditing(false) } />
                </StyledPaper>
                : <StyledPaper>
                    <MeetingDetails
                        loading = { loading }
                        meeting = { meeting }
                        onEditClick = { () => setIsEditing(true) } />
                </StyledPaper>
            : isCreating
                ? <StyledPaper title = 'Create Personal Meeting Room'>
                    <CreatePersonalMeeting
                        onCancelCreate = { () => setIsCreating(false) }
                        onSuccessCreate = { () => setIsCreating(false) } />
                </StyledPaper>
                : <StyledPaper>
                    <NoPersonalMeeting handleCreateRoom = { () => setIsCreating(true) } />
                </StyledPaper>
    );
}

PersonalMeeting.propTypes = {
    loading: PropTypes.bool,
    meeting: PropTypes.object
};

export default PersonalMeeting;
