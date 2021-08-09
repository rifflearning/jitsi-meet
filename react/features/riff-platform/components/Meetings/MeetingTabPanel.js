/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-native/no-color-literals */
/* eslint-disable require-jsdoc */

import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import React from 'react';

function MeetingTabPanel({ children, value, index }) {
    return (
        <div
            aria-labelledby = { `meeting-tab-${index}` }
            hidden = { value !== index }
            id = { `meeting-tabpanel-${index}` }
            style = {{ color: '#ffffff',
                width: '100%' }}>
            {value === index && (
                <Box pt = { 2 }>
                    {children}
                </Box>
            )}
        </div>
    );
}

MeetingTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
};

export default MeetingTabPanel;
