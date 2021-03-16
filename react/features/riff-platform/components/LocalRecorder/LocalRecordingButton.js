/* eslint-disable react/jsx-no-bind */
import PropTypes from 'prop-types';
import React from 'react';

import { toggleDialog } from '../../../base/dialog/actions';
import { IconRec } from '../../../base/icons';
import { connect } from '../../../base/redux';
import { OverflowMenuItem } from '../../../base/toolbox';
import ToolbarButton from '../../../toolbox/components/web/ToolbarButton';

import LocalRecordingDialog from './LocalRecordingDialog';

const LocalRecordingButton = ({ toggleLocalRecordingDialog, isOverflowButton }) => {

    const doToggleLocalRecordingDialog = () => toggleLocalRecordingDialog();

    return (
        isOverflowButton
            ? <OverflowMenuItem
                accessibilityLabel = 'Toggle local recording'
                icon = { IconRec }
                key = 'rifflocalrecording'
                onClick = { doToggleLocalRecordingDialog }
                text = { 'Local Recording' } />
            : <ToolbarButton
                accessibilityLabel = 'Toggle local recording'
                icon = { IconRec }
                onClick = { doToggleLocalRecordingDialog }
                tooltip = 'Local Recording' />

    );
};

LocalRecordingButton.propTypes = {
    isEngaged: PropTypes.bool,
    isOverflowButton: PropTypes.bool,
    toggleLocalRecordingDialog: PropTypes.func
};

const mapStateToProps = () => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {
        toggleLocalRecordingDialog: () => dispatch(toggleDialog(LocalRecordingDialog))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LocalRecordingButton);
