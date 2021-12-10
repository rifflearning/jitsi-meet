import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

const styles = {
    marginTop: {
        marginTop: '50px'
    }
};

const Text = ({ text }) => (
    <div>
        <Typography
            align = 'center'
            style = { styles.marginTop }
            variant = 'h5'>
            {text}
        </Typography>
    </div>
);


Text.propTypes = {
    text: PropTypes.string
};

export default Text;
