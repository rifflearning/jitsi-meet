/* ******************************************************************************
 * index.js                                                                     *
 * *************************************************************************/ /**
 *
 * @fileoverview Hook up the Metric charts to redux state and actions
 *
 * [More detail about the file's contents]
 *
 * Created on       May 30, 2019
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2019-present Riff Learning, Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import { connect } from 'react-redux';

import { dashboardGraphLoaded } from 'redux/actions/dashboard';
import { getDatasetForGraph, getSelectedMeeting } from 'redux/selectors/dashboard';
import { getUserId } from 'redux/selectors/user';

import { ParticipantScore } from './ParticipantScore';
import { TimelineChart } from './TimelineChart';
import { StackedBarGraph } from './StackedBarGraph';
import { SpeakingTime } from './SpeakingTime';
import { MeetingInfo } from './MeetingInfo';


const graphsMapDispatch = dispatch => ({
    dashboardGraphLoaded: (graphType) => {
        return dispatch(dashboardGraphLoaded(graphType));
    },
});

const infoMapProps = {
    mapStateToProps: state => ({
        meeting: getSelectedMeeting(state),
    }),
};

const pieChartMapProps = {
    mapStateToProps: (state, ownProps) => ({
        participantId: getUserId(state),
        meeting:       getSelectedMeeting(state),
        graphDataset:  getDatasetForGraph(state, ownProps.graphType),
    }),
};

const stackedBarGraphMapProps = {
    mapStateToProps: (state, ownProps) => ({
        participantId: getUserId(state),
        meeting:       getSelectedMeeting(state),
        graphDataset:  getDatasetForGraph(state, ownProps.graphType),
    }),
};


// TODO: specify which datasets should be passed, right now, timeline uses all
const timelineChartMapProps = {
    mapStateToProps: state => ({
        participantId: getUserId(state),
        meeting:       getSelectedMeeting(state),
        graphDatasets: state.dashboard.graphDatasets,
    }),
};

// TODO: specify which datasets should be passed, right now, participant score uses all
const participantScoreMapProps = {
    mapStateToProps: state => ({
        participantId: getUserId(state),
        meeting:       getSelectedMeeting(state),
        graphDatasets: state.dashboard.graphDatasets,
    }),
};

/* eslint-disable no-multi-spaces */
const ConnectedMeetingInfo = connect(infoMapProps.mapStateToProps)(MeetingInfo);
const ConnectedParticipantScore =   connect(participantScoreMapProps.mapStateToProps,
                                            graphsMapDispatch)(ParticipantScore);
const ConnectedTimelineChart =      connect(timelineChartMapProps.mapStateToProps,
                                            graphsMapDispatch)(TimelineChart);
const ConnectedStackedBarGraph =    connect(stackedBarGraphMapProps.mapStateToProps,
                                            graphsMapDispatch)(StackedBarGraph);
const ConnectedSpeakingTime =       connect(pieChartMapProps.mapStateToProps,
                                            graphsMapDispatch)(SpeakingTime);
/* eslint-enable no-multi-spaces */

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    ConnectedParticipantScore as ParticipantScore,
    ConnectedMeetingInfo as MeetingInfo,
    ConnectedTimelineChart as TimelineChart,
    ConnectedStackedBarGraph as StackedBarGraph,
    ConnectedSpeakingTime as SpeakingTime,
};
