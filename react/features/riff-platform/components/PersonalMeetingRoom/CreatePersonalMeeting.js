import PropTypes from 'prop-types';
import React from 'react';

import PersonalMeetingForm from './PersonalMeetingForm';

const CreatePersonalMeeting = ({ onCancelCreate, onSuccessCreate }) => (

    <PersonalMeetingForm
        isEditing = { false }
        onCancel = { onCancelCreate }
        onSuccess = { onSuccessCreate } />
);

CreatePersonalMeeting.propTypes = {
    meeting: PropTypes.object,
    onCancelCreate: PropTypes.func,
    onSuccessCreate: PropTypes.func
};

export default CreatePersonalMeeting;
