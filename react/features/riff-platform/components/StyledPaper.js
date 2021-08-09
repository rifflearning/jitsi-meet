import { makeStyles, Paper } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

import Title from './Title';

const useStyles = makeStyles(theme => {
    return {
        paper: {
            padding: theme.spacing(2),
            display: 'flex',
            overflow: 'auto',
            flexDirection: 'column'
        }
    };
});

const StyledPaper = ({ title, children }) => {
    const classes = useStyles();

    return (
        <Paper className = { classes.paper }>
            <React.Fragment>
                <Title>{title}</Title>
                {children}
            </React.Fragment>
        </Paper>
    );
};

StyledPaper.propTypes = {
    children: PropTypes.node,
    title: PropTypes.string
};


export default StyledPaper;
