import PropTypes from 'prop-types';
import React from 'react';

import { Label } from '../../../base/label/index';
import { connect } from '../../../base/redux';
import { Tooltip } from '../../../base/tooltip';

const LocalRecordingLabel = ({ isEngaged }) => {

    if (!isEngaged) {
        return null;
    }

    return (
        <Tooltip
            content = { 'Local recording is engaged' }
            position = { 'bottom' }>
            <Label
                className = 'local-rec-label'
                text = { 'REC' } />
        </Tooltip>
    );
};

LocalRecordingLabel.propTypes = {
    isEngaged: PropTypes.bool
};

const mapStateToProps = state => {
    return {
        isEngaged: state['features/riff-platform'].localRecording.isEngaged
    };
};

export default connect(mapStateToProps)(LocalRecordingLabel);
