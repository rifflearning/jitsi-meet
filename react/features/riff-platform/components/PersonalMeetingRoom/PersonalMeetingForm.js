/* eslint-disable react/jsx-sort-props */
/* eslint-disable require-jsdoc */
/* eslint-disable react/no-multi-comp */
/* eslint-disable react/jsx-no-bind */
import {
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    TextField
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import { connect } from '../../../base/redux';
import { createPersonalMeetingRoom, updatePersonalMeetingRoom } from '../../actions/personalMeeting';

const useStyles = makeStyles(theme => {
    return {
        paper: {
            marginTop: theme.spacing(4),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        },
        form: {
            width: '99%', // Fix IE 11 issue. and bottom scroll issue
            marginTop: theme.spacing(1)
        },
        submit: {
            margin: theme.spacing(3, 0, 2)
        },
        formAlert: {
            border: 'none'
        }
    };
});

const PersonalMeetingForm = ({
    createError,
    createLoading,
    user,
    isEditing,
    meeting,
    createMeeting,
    updateError,
    updateLoading,
    updateMeeting,
    onSuccess,
    onCancel
}) => {

    const defaultMeetingName = `${user.displayName}'s Meeting`;
    const defaultMeetingDesc = `${user.displayName}'s Personal Meeting Room`;

    const [ name, setName ] = useState(defaultMeetingName);
    const [ description, setDescription ] = useState(defaultMeetingDesc);
    const [ allowAnonymous, setAllowAnonymous ] = useState(true);
    const [ waitForHost, setWaitForHost ] = useState(true);

    const [ nameError, setNameError ] = useState('');

    const classes = useStyles();

    const isNameValid = () => Boolean(name.length);

    const isFormValid = () => {
        let isValid = true;

        setNameError('');

        if (!isNameValid()) {
            isValid = false;
            setNameError('Please, enter name');
        }

        return isValid;
    };

    const successCallback = () => onSuccess();

    const handleSubmit = e => {
        e.preventDefault();
        if (!isFormValid()) {
            return;
        }
        const personalMeetingData = {
            createdBy: user.uid,
            name,
            description,
            dateStart: null,
            dateEnd: null,
            isPersonal: true,
            allowAnonymous,
            waitForHost,
            recurrenceValues: null,
            timezone: null,
            recurrenceOptions: null,
            forbidNewParticipantsAfterDateEnd: null,
            multipleRoomsQuantity: null
        };

        if (!isEditing) {
            return createMeeting(personalMeetingData, successCallback);
        } else if (isEditing) {
            return updateMeeting(meeting._id, { roomId: meeting.roomId,
                ...personalMeetingData }, successCallback);
        }
    };

    useEffect(() => {
        if (meeting && isEditing) {
            setName(meeting.name);
            setDescription(meeting.description);
            setWaitForHost(meeting.waitForHost);
            setAllowAnonymous(meeting.allowAnonymous);
        }
    }, [ meeting ]);

    return (
        <form
            autoComplete = 'off'
            className = { classes.form }
            noValidate = { true }
            onSubmit = { handleSubmit } >
            <Grid
                container = { true }
                spacing = { 1 }>
                <Grid
                    item = { true }
                    xs = { 12 }
                    sm = { 10 }
                    md = { 8 }>
                    <TextField
                        variant = 'outlined'
                        margin = 'normal'
                        required = { true }
                        fullWidth = { true }
                        id = 'name'
                        label = 'Meeting name'
                        name = 'name'
                        autoFocus = { true }
                        value = { name }
                        onChange = { e => setName(e.target.value) }
                        error = { Boolean(nameError) }
                        helperText = { nameError } />
                </Grid>
                <Grid
                    item = { true }
                    xs = { 12 }
                    sm = { 10 }
                    md = { 8 }>
                    <TextField
                        variant = 'outlined'
                        margin = 'normal'
                        fullWidth = { true }
                        id = 'description'
                        label = 'Description (Optional)'
                        name = 'description'
                        value = { description }
                        onChange = { e => setDescription(e.target.value) } />
                </Grid>
                <Grid
                    item = { true }
                    xs = { 12 }>
                    <FormControlLabel
                        label = 'Wait for a host of the meeting'
                        control = { <Checkbox
                            name = 'waitForHost'
                            checked = { waitForHost }
                            onChange = { e => setWaitForHost(e.target.checked) } />
                        } />
                </Grid>
            </Grid>

            <Grid
                container = { true }
                spacing = { 1 }>

                <Grid
                    item = { true }
                    xs = { 12 }>
                    <FormControlLabel
                        label = 'Allow guest users'
                        control = { <Checkbox
                            name = 'allowAnonymous'
                            checked = { allowAnonymous }
                            onChange = { e => setAllowAnonymous(e.target.checked) } />
                        } />
                </Grid>
            </Grid>

            <Grid
                container = { true }
                spacing = { 3 }>
                <Grid item = { true }>

                    <Button
                        type = 'submit'
                        variant = 'contained'
                        color = 'primary'
                        className = { classes.submit }
                        disabled = { createLoading || updateLoading }>
                            Save
                    </Button>
                </Grid>
                <Grid item = { true }>
                    <Button
                        variant = 'outlined'
                        className = { classes.submit }
                        onClick = { () => onCancel() }>
                        Cancel
                    </Button>
                </Grid>


            </Grid>

            {(createError || updateError) && <Alert
                className = { classes.formAlert }
                severity = 'error'
                variant = 'outlined'>{ createError || (isEditing && updateError)}</Alert> }
        </form>
    );
};

PersonalMeetingForm.propTypes = {
    createError: PropTypes.string,
    createLoading: PropTypes.bool,
    createMeeting: PropTypes.func,
    isEditing: PropTypes.bool,
    meeting: PropTypes.object,
    onCancel: PropTypes.func,
    onSuccess: PropTypes.func,
    updateError: PropTypes.string,
    updateLoading: PropTypes.bool,
    updateMeeting: PropTypes.func,
    user: PropTypes.object
};

const mapStateToProps = state => {
    return {
        user: state['features/riff-platform'].signIn.user,
        createLoading: state['features/riff-platform'].scheduler.loading,
        createError: state['features/riff-platform'].scheduler.error,
        updateError: state['features/riff-platform'].scheduler.updateError,
        updateLoading: state['features/riff-platform'].scheduler.updateLoading
    };
};
const mapDispatchToProps = dispatch => {
    return {
        createMeeting: (meeting, callback) => dispatch(createPersonalMeetingRoom(meeting, callback)),
        updateMeeting: (id, meeting, callback) => dispatch(updatePersonalMeetingRoom(id, meeting, callback))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PersonalMeetingForm);
