/* eslint-disable require-jsdoc */
/* eslint-disable react/no-multi-comp */
/* eslint-disable react/jsx-no-bind */

import { Button, Grid, Box, makeStyles } from '@material-ui/core';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router';

import { connect } from '../../../base/redux';
import { getMeetings, getMeetingsByGroup, setMeetingsListType } from '../../actions/meetings';
import * as ROUTES from '../../constants/routes';
import { groupMeetingsByDays } from '../../functions';
import Loader from '../Loader';
import StyledPaper from '../StyledPaper';

import MeetingTabPanel from './MeetingTabPanel';
import MeetingsTable from './MeetingsTable';

const useStyles = makeStyles(() => {
    return {
        tab: {
            color: '#ffffff'
        }
    };
});

const meetingListTypeMap = {
    upcoming: 0,
    previous: 1
};

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

const MeetingsList = ({ groupedMeetings = [], isGroup }) => (
    <Grid
        container = { true }
        spacing = { 3 }>
        {Object.keys(groupedMeetings).map(date => (<Grid
            item = { true }
            key = { date }
            xs = { 12 }>
            <StyledPaper title = { date }>
                <MeetingsTable
                    isGroup = { isGroup }
                    meetingsList = { groupedMeetings[date] } />
            </StyledPaper>
        </Grid>)
        )}
    </Grid>
);

MeetingsList.propTypes = {
    // isGroup - external prop for separate group (harvard), disable 'delete' button, fetch groupped meeting.
    groupedMeetings: PropTypes.object,
    isGroup: PropTypes.bool
};

function Meetings({
    meetingsLists = [],
    getMeetingsLists,
    getMeetingsListByGroup,
    isGroup,
    loading,
    meetingsListType,
    updateMeetingsListType
}) {

    const classes = useStyles();
    const history = useHistory();
    const handleScheduleClick = useCallback(() => history.push(ROUTES.SCHEDULE), [ history ]);

    useEffect(() => {
        if (isGroup) {
            getMeetingsListByGroup(meetingsListType);
        } else {
            getMeetingsLists(meetingsListType);
        }
    }, [ meetingsListType ]);

    const groupedMeetings = groupMeetingsByDays(meetingsLists);

    // eslint-disable-next-line max-len
    const noMeetingDataText = `There are no ${meetingsListType} meetings. To schedule a new meeting click SCHEDULE A MEETING`;

    const meetingsTabContent = Object.keys(groupedMeetings).length
        ? (<MeetingsList
            groupedMeetings = { groupedMeetings }
            isGroup = { isGroup } />)
        : noMeetingDataText;

    return (
        <Grid
            container = { true }
            spacing = { 3 }>
            <Grid
                item = { true }
                xs = { 12 }>
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
                                    updateMeetingsListType(getKeyByValue(meetingListTypeMap, type)) }
                                value = { meetingListTypeMap[meetingsListType] }>
                                <Tab
                                    className = { classes.tab }
                                    label = 'Upcoming' />
                                <Tab
                                    className = { classes.tab }
                                    label = 'Previous' />
                            </Tabs>
                        </Box>
                    </Grid>
                    <Grid item = { true }>
                        <Button
                            color = 'primary'
                            onClick = { handleScheduleClick }
                            variant = 'outlined'>
                        Schedule a meeting
                        </Button>
                    </Grid>
                </Grid>
                {loading
                    ? <Loader />
                    : <Grid
                        container = { true }
                        item = { true }
                        justify = 'center'
                        xs = { 12 }>
                        <MeetingTabPanel
                            index = { 0 }
                            value = { meetingListTypeMap[meetingsListType] }>
                            { meetingsTabContent }
                        </MeetingTabPanel>
                        <MeetingTabPanel
                            index = { 1 }
                            value = { meetingListTypeMap[meetingsListType] }>
                            { meetingsTabContent }
                        </MeetingTabPanel>
                    </Grid>}
            </Grid>
        </Grid>
    );
}

Meetings.propTypes = {
    getMeetingsListByGroup: PropTypes.func,
    getMeetingsLists: PropTypes.func,

    // isGroup - external prop for separate group (harvard), disable 'delete' button, fetch groupped meeting.
    isGroup: PropTypes.bool,
    loading: PropTypes.bool,
    meetingsListType: PropTypes.string,
    meetingsLists: PropTypes.array,
    updateMeetingsListType: PropTypes.func
};

const mapStateToProps = state => {
    return {
        meetingsLists: state['features/riff-platform'].meetings.meetingsLists,
        loading: state['features/riff-platform'].meetings.loading,
        meetingsListType: state['features/riff-platform'].meetings.listType
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getMeetingsListByGroup: listType => dispatch(getMeetingsByGroup(listType)),
        getMeetingsLists: listType => dispatch(getMeetings(listType)),
        updateMeetingsListType: listType => dispatch(setMeetingsListType(listType))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Meetings);
