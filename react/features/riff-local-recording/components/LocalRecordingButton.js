/* eslint-disable react/jsx-no-bind */
import PropTypes from 'prop-types';
import React from 'react';

import { toggleDialog } from '../../base/dialog/actions';
import { isMobileBrowser } from '../../base/environment/utils';
import { IconRec } from '../../base/icons';
import { connect } from '../../base/redux';
import ToolboxItem from '../../base/toolbox/components/ToolboxItem.web';
import { recordingController } from '../controller/RecordingController';

import LocalRecordingDialog from './LocalRecordingDialog';


const LocalRecordingButton = ({
    toggleLocalRecordingDialog,
    showLabel,
    contextMenu,
    isEngagedLocally
}) => {
    const doToggleLocalRecordingDialog = () => toggleLocalRecordingDialog();
    const doStopLocalRecording = () => recordingController.stopRecording();

    const isMobile = isMobileBrowser();

    if (isMobile) {
        return null;
    }

    return (
        <ToolboxItem
            accessibilityLabel = 'Local Recording'
            contextMenu = { contextMenu }
            icon = { IconRec }
            label = { `${isEngagedLocally ? 'Stop' : 'Start'} Local Recording` }
            onClick = { isEngagedLocally ? doStopLocalRecording : doToggleLocalRecordingDialog }
            showLabel = { showLabel } />
    );
};

LocalRecordingButton.propTypes = {
    contextMenu: PropTypes.bool,
    isEngagedLocally: PropTypes.bool,
    showLabel: PropTypes.bool,
    toggleLocalRecordingDialog: PropTypes.func
};

const mapStateToProps = state => {
    return {
        isEngagedLocally: state['features/riff-local-recording'].stats?.isRecording
    };
};

const mapDispatchToProps = dispatch => {
    return {
        toggleLocalRecordingDialog: () => dispatch(toggleDialog(LocalRecordingDialog))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LocalRecordingButton);
