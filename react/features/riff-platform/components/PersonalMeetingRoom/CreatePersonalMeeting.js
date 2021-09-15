/* eslint-disable require-jsdoc */
/* eslint-disable react/no-multi-comp */
/* eslint-disable react/jsx-no-bind */

import { Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

import StyledPaper from '../StyledPaper';

import PersonalMeetingForm from './PersonalMeetingForm';

const CreatePersonalMeeting = ({ onCancelCreate, onSuccessCreate }) => (
    <Grid
        container = { true }
        spacing = { 3 }>
        <Grid
            item = { true }
            xs = { 12 }>
            <StyledPaper title = 'Create Personal Meeting Room'>
                <PersonalMeetingForm
                    isEditing = { false }
                    onCancel = { onCancelCreate }
                    onSuccess = { onSuccessCreate } />
            </StyledPaper>
        </Grid>
    </Grid>
);

CreatePersonalMeeting.propTypes = {
    meeting: PropTypes.object,
    onCancelCreate: PropTypes.func,
    onSuccessCreate: PropTypes.func
};

export default CreatePersonalMeeting;
