import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles({
    bold: {
        fontWeight: 600
    }
});

const Title = props => {
    const classes = useStyles();

    return (
        <Typography
            className = { classes.bold }
            component = 'p'
            gutterBottom = { true }
            variant = 'subtitle1'>
            {props.children}
        </Typography>
    );
};

Title.propTypes = {
    children: PropTypes.node
};

export default Title;
