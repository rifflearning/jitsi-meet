import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import React from 'react';

const Title = props => (
    <Typography
        component = 'p'
        gutterBottom = { true }
        variant = 'subtitle1'>
        {props.children}
    </Typography>
);

Title.propTypes = {
    children: PropTypes.node
};

export default Title;
