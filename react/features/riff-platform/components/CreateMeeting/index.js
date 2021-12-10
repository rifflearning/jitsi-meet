/* eslint-disable react/jsx-no-bind */
import { Grid, Box, Tabs, Tab, makeStyles } from '@material-ui/core';
import React, { useState } from 'react';

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

const CreateMeeting = () => {
    const [ selectedTab, setSelectedTab ] = useState(0);

    const classes = useStyles();

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
                        <PersonalMeeting />
                    </Grid>
                </TabPanel>
            </Grid>
        </Grid>
    );
};

export default CreateMeeting;
