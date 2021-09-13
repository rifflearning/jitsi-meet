/* eslint-disable react/jsx-no-bind */
import { Grid, Box, Tabs, Tab, makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import { connect } from '../../../base/redux';
import { getUserPersonalMeetingRoom } from '../../actions/personalMeeting';
import PersonalMeeting from '../PersonalMeetingRoom/PersonalMeeting';
import Scheduler from '../Scheduler';
import TabPanel from '../TabPanel';

const useStyles = makeStyles(() => {
    return {
        tab: {
            color: '#ffffff'
        }
    };
});

const CreateMeeting = ({
    personalMeeting,
    fetchPersonalMeeting,
    error,
    loading }) => {
    const [ selectedTab, setSelectedTab ] = useState(0);

    const classes = useStyles();

    useEffect(() => {
        if (!personalMeeting?.id) {
            fetchPersonalMeeting();
        }
    }, []);

    return (
        <Grid
            alignItems = 'center'
            container = { true }
            item = { true }
            justify = 'space-between'
            xs = { 12 }>
            <Grid
                item = { true }>
                <Box pb = { 1 }>
                    <Tabs
                        onChange = { (_event, type) =>
                            setSelectedTab(type) }
                        value = { selectedTab }>
                        <Tab
                            className = { classes.tab }
                            label = 'Schedule a meeting' />
                        <Tab
                            className = { classes.tab }
                            label = 'Use Personal Meeting Room' />
                    </Tabs>
                </Box>
            </Grid>
            <Grid
                container = { true }
                item = { true }
                justify = 'center'>
                <TabPanel
                    index = { 0 }
                    value = { selectedTab }>
                    <Scheduler />
                </TabPanel>
                <TabPanel
                    index = { 1 }
                    value = { selectedTab }>
                    <Grid
                        item = { true }
                        xs = { 12 }>
                        <PersonalMeeting
                            error = { error }
                            loading = { loading }
                            meeting = { personalMeeting } />
                    </Grid>
                </TabPanel>
            </Grid>
        </Grid>
    );
};

CreateMeeting.propTypes = {
    error: PropTypes.string,
    fetchPersonalMeeting: PropTypes.func,
    loading: PropTypes.bool,
    personalMeeting: PropTypes.object
};

const mapStateToProps = state => {
    return {
        personalMeeting: state['features/riff-platform'].personalMeeting.meeting,
        loading: state['features/riff-platform'].personalMeeting.loading,
        error: state['features/riff-platform'].personalMeeting.error
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchPersonalMeeting: () => dispatch(getUserPersonalMeetingRoom())
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(CreateMeeting);
