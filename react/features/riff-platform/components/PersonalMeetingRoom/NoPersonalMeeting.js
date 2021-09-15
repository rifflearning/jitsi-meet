/* eslint-disable react/jsx-no-bind */
import { Grid, Button, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

const NoPersonalMeeting = ({ handleCreateRoom }) => (
    <Grid
        alignItems = 'center'
        container = { true }
        justify = 'space-between'>
        <Grid
            item = { true }>
            <Typography>
                You don`t have a personal meeting room
            </Typography>
        </Grid>
        <Grid
            alignItems = 'center'
            container = { true }
            item = { true }
            justify = 'flex-end'
            xs = { 6 }>
            <Button
                color = 'primary'
                onClick = { () => handleCreateRoom() }
                variant = 'contained'>
                    Create your room
            </Button>
        </Grid>
    </Grid>
);

NoPersonalMeeting.propTypes = {
    handleCreateRoom: PropTypes.func
};

export default NoPersonalMeeting;
