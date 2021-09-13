/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-native/no-color-literals */
/* eslint-disable require-jsdoc */

import { Box, makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles(() => {
    return {
        tab: {
            color: '#ffffff',
            width: '100%'
        }
    };
});

const TabPanel = ({ children, value, index }) => {
    const classes = useStyles();

    return (
        <Box
            className = { classes.tab }
            hidden = { value !== index }
            id = { `tabpanel-${index}` }>
            {value === index && (
                <Box pt = { 2 }>
                    {children}
                </Box>
            )}
        </Box>
    );
};

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
};

export default TabPanel;
