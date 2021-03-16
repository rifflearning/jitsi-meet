/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable require-jsdoc */

import { Typography, List, ListItem, ListItemText } from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';

import { hideDialog, Dialog } from '../../../base/dialog';
import { connect } from '../../../base/redux';

import { recordingController } from './LocalRecorderController';

const useStyles = makeStyles(() => {
    return {
        root: {
            width: '100%',
            maxWidth: 360,
            backgroundColor: 'none'
        },
        paper: {
            width: '80%',
            maxHeight: 435
        }
    };
});


const recordingSteps = [ 'To start recording click on start recording',
    'Select screen type to start recording',
    'Click on share button to confirm recording',
    'To stop recording click on stop recording'
];


function LocalRecordingDialog({ onClose, localRecordingIsEngaged }) {

    const classes = useStyles();

    const handleCancel = () => {
        onClose();
    };

    const handleStart = () => {
        recordingController.startRecording();
        handleCancel();
    };


    const handleStop = () => {
        recordingController.stopRecording();
        handleCancel();
    };

    const onSubmit = () => {
        if (!localRecordingIsEngaged) {
            return handleStart();
        }
        handleStop();
    };

    const renderControls = (
    <>
        <Typography>Follow the below steps to do screen recording:</Typography>
        <List>
            {recordingSteps.map((el, i) => (
                <ListItem
                    dense = { true }
                    disableGutters = { true }
                    key = { i }>
                    <ListItemText
                        primary = { `*${el}` } />
                </ListItem>
            ))}
        </List>
    </>);

    // eslint-disable-next-line no-negated-condition
    const defineSubmitButtonText = !localRecordingIsEngaged ? 'Start Recording' : 'Stop Recording';

    return (
        <Dialog
            cancelKey = { 'dialog.close' }
            className = { classes.root }
            maxWidth = 'md'
            okKey = { defineSubmitButtonText }
            onCancel = { handleCancel }
            onSubmit = { onSubmit }>
            <Typography style = {{ fontSize: '1.5rem' }}>Local Recording</Typography>
            <DialogContent dividers = { true }>
                {renderControls}
            </DialogContent>
        </Dialog>
    );
}

LocalRecordingDialog.propTypes = {
    localRecordingIsEngaged: PropTypes.bool,
    onClose: PropTypes.func
};

const mapStateToProps = state => {

    return {
        localRecordingIsEngaged: state['features/riff-platform'].localRecording.isEngaged
    };
};
const mapDispatchToProps = dispatch => {
    return {
        onClose: () => dispatch(hideDialog())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LocalRecordingDialog);
