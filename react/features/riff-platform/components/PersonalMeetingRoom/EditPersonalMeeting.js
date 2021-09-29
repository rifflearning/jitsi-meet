
import PropTypes from 'prop-types';
import React from 'react';

import PersonalMeetingForm from './PersonalMeetingForm';

const EditPesonalMeeting = ({ meeting, onSuccessEdit, onCancelEdit }) => (
    <PersonalMeetingForm
        isEditing = { true }
        meeting = { meeting }
        onCancel = { onCancelEdit }
        onSuccess = { onSuccessEdit } />
);

EditPesonalMeeting.propTypes = {
    meeting: PropTypes.object,
    onCancelEdit: PropTypes.func,
    onSuccessEdit: PropTypes.func
};

export default EditPesonalMeeting;
