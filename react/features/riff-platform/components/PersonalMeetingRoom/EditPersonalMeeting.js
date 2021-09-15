/* eslint-disable require-jsdoc */
/* eslint-disable react/no-multi-comp */
/* eslint-disable react/jsx-no-bind */

import { Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

import StyledPaper from '../StyledPaper';

import PersonalMeetingForm from './PersonalMeetingForm';

const EditPesonalMeeting = ({ meeting, onSuccessEdit, onCancelEdit }) => (
    <Grid
        container = { true }
        spacing = { 3 }>
        <Grid
            item = { true }
            xs = { 12 }>
            <StyledPaper title = 'Edit Personal Meeting Room'>
                <PersonalMeetingForm
                    isEditing = { true }
                    meeting = { meeting }
                    onCancel = { onCancelEdit }
                    onSuccess = { onSuccessEdit } />
            </StyledPaper>
        </Grid>
    </Grid>
);

EditPesonalMeeting.propTypes = {
    meeting: PropTypes.object,
    onCancelEdit: PropTypes.func,
    onSuccessEdit: PropTypes.func
};

export default EditPesonalMeeting;
