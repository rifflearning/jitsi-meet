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

const LocalRecordingButton = ({ toggleLocalRecordingDialog, isEngagedLocally, isOverflowButton }) => {

    const doToggleLocalRecordingDialog = () => toggleLocalRecordingDialog();
    const doStopLocalRecording = () => recordingController.stopRecording();

    return (
        isOverflowButton
            ? <OverflowMenuItem
                accessibilityLabel = 'Local Recording'
                icon = { IconRec }
                key = 'rifflocalrecording'
                onClick = { isEngagedLocally ? doStopLocalRecording : doToggleLocalRecordingDialog }
                text = { isEngagedLocally ? 'Stop Local Recording' : 'Start Local Recording' } />
            : <ToolbarButton
                accessibilityLabel = 'Toggle Local Recording'
                icon = { IconRec }
                onClick = { isEngagedLocally ? doStopLocalRecording : doToggleLocalRecordingDialog }
                toggled = { isEngagedLocally }
                tooltip = 'Start / Stop Local Recording' />

    );
};

LocalRecordingButton.propTypes = {
    isEngagedLocally: PropTypes.bool,
    isOverflowButton: PropTypes.bool,
    toggleLocalRecordingDialog: PropTypes.func
};

const mapStateToProps = state => {
    return {
        isEngagedLocally: state['features/riff-platform'].localRecording.stats?.isRecording
    };
};

const mapDispatchToProps = dispatch => {
    return {
        toggleLocalRecordingDialog: () => dispatch(toggleDialog(LocalRecordingDialog))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LocalRecordingButton);
