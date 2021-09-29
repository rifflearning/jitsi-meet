/* eslint-disable react-native/no-inline-styles */
import { CircularProgress, Grid, makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(() => {
    return {
        container: {
            margin: '20px 0 20px 0'
        }
    };
});

const Loader = () => {
    const classes = useStyles();

    return (
        <Grid
            className = { classes.container }
            container = { true }
            item = { true }
            justify = 'center'
            xs = { 12 }><CircularProgress /></Grid>
    );
};

export default Loader;
