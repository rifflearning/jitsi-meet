/* eslint-disable react-native/no-inline-styles */
import { CircularProgress, Grid } from '@material-ui/core';
import React from 'react';

const Loader = () => (<div style = {{ marginTop: '100px' }}>
    <Grid
        container = { true }
        item = { true }
        justify = 'center'
        xs = { 12 }><CircularProgress /></Grid>
</div>);

export default Loader;
