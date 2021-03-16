/* eslint-disable react/jsx-no-bind */
import PropTypes from 'prop-types';
import React from 'react';

import { toggleDialog } from '../../../base/dialog/actions';
import { IconRec } from '../../../base/icons';
import { connect } from '../../../base/redux';
import ToolbarButton from '../../../toolbox/components/web/ToolbarButton';

import LocalRecordingDialog from './LocalRecordingDialog';

const LocalRecordingButton = ({ toggleLocalRecordingDialog }) => {

    const doToggleLocalRecordingDialog = () => toggleLocalRecordingDialog();

    return (
        <ToolbarButton
            accessibilityLabel = 'Toggle local recording'
            icon = { IconRec }
            onClick = { doToggleLocalRecordingDialog }
            tooltip = 'Local Recording' />
    );
};

LocalRecordingButton.propTypes = {
    toggleLocalRecordingDialog: PropTypes.func
};

const mapStateToProps = () => {
    return { };
};

const mapDispatchToProps = dispatch => {
    return {
        toggleLocalRecordingDialog: () => dispatch(toggleDialog(LocalRecordingDialog))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LocalRecordingButton);
