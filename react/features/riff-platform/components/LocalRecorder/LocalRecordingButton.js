/* eslint-disable react/jsx-no-bind */
import PropTypes from 'prop-types';
import React from 'react';

import { toggleDialog } from '../../../base/dialog/actions';
import { IconRec } from '../../../base/icons';
import { connect } from '../../../base/redux';
import { OverflowMenuItem } from '../../../base/toolbox';
import ToolbarButton from '../../../toolbox/components/web/ToolbarButton';

import { recordingController } from './LocalRecorderController';
import LocalRecordingDialog from './LocalRecordingDialog';

const LocalRecordingButton = ({ toggleLocalRecordingDialog, isEngaged, isOverflowButton }) => {

    const doToggleLocalRecordingDialog = () => toggleLocalRecordingDialog();
    const doStopLocalRecording = () => recordingController.stopRecording();

    return (
        isOverflowButton
            ? <OverflowMenuItem
                accessibilityLabel = { 'Local Recording' }
                icon = { IconRec }
                key = 'rifflocalrecording'
                onClick = { isEngaged ? doStopLocalRecording : doToggleLocalRecordingDialog }
                text = { isEngaged ? 'Stop Local Recording' : 'Start Local Recording' } />
            : <ToolbarButton
                accessibilityLabel = 'Toggle local recording'
                icon = { IconRec }
                onClick = { isEngaged ? doStopLocalRecording : doToggleLocalRecordingDialog }
                toggled = { isEngaged }
                tooltip = 'Local Recording' />

    );
};

LocalRecordingButton.propTypes = {
    isEngaged: PropTypes.bool,
    isOverflowButton: PropTypes.bool,
    toggleLocalRecordingDialog: PropTypes.func
};

const mapStateToProps = state => {
    return {
        isEngaged: state['features/riff-platform'].localRecording.stats?.isRecording
    };
};

const mapDispatchToProps = dispatch => {
    return {
        toggleLocalRecordingDialog: () => dispatch(toggleDialog(LocalRecordingDialog))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LocalRecordingButton);
