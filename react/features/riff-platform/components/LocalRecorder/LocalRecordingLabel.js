// @flow

import Tooltip from '@atlaskit/tooltip';
import PropTypes from 'prop-types';
import React from 'react';

import { CircularLabel } from '../../../base/label/index';
import { connect } from '../../../base/redux';

const LocalRecordingLabel = ({ isEngaged }) => {
    console.log('isEngaged', isEngaged)

    if (!isEngaged) {
        return null;
    }

    return (
        <Tooltip
            content = { 'Local recording is engaged' }
            position = { 'left' }>
            <CircularLabel
                className = 'local-rec'
                label = { 'REC' } />
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

