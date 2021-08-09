/* eslint-disable valid-jsdoc */
/* ******************************************************************************
 * Interruptions.js                                                                *
 * *************************************************************************/ /**
 *
 * @fileoverview React component to visualize the interruptions of and to
 * a participant in a meeting.
 *
 * Created on       August 13, 2020
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2020 Riff Analytics,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/
import { GraphDatasetTypes, GraphTypes } from '@rifflearning/riff-metrics';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { EventTypes } from '../config';
import { metricGraphLoaded, getSelectedMeeting, getMetricDataset, getDatasetStatus } from '../utils';

import { StackedBarGraph } from './StackedBarGraph';

/* ******************************************************************************
 * Interruptions                                                               */ /**
 *
 * React component to visualize the interruptions of/to a participant in a meeting.
 *
 ********************************************************************************/
class Interruptions extends React.PureComponent {
    static propTypes = {
        /** Sets a graphical rendering status for a graph type to loaded */
        dashboardGraphLoaded: PropTypes.func.isRequired,

        /** The request status of the graphDataset */
        datasetStatus: PropTypes.string.isRequired,

        /** The main dataset that is used for this graph */
        graphDataset: PropTypes.object.isRequired,

        /** Meeting whose relevant data will be in graphDataset */
        meeting: PropTypes.shape({
            _id: PropTypes.string.isRequired,
            participants: PropTypes.instanceOf(Map).isRequired
        }),

        /** ID of the logged in user so their data can be distinguished */
        participantId: PropTypes.string.isRequired
    };

    /** The GraphType of this component */
    static graphType = GraphTypes.GROUPED_INTERRUPTIONS;

    /** The GraphDatasetType of the graphDataset property */
    static datasetType = GraphDatasetTypes.INTERRUPTIONS;

    /* **************************************************************************
     * render                                                              */ /**
     *
     * Required method of a React component.
                                                                               *
     * @see {@link https://reactjs.org/docs/react-component.html#render|React.Component.render}
     */
    render() {
        return (
            <StackedBarGraph
                graphType = { Interruptions.graphType }
                stackedEventTypes = { [
                    EventTypes.MY_INTERRUPTIONS,
                    EventTypes.THEIR_INTERRUPTIONS
                ] }
                { ...this.props } />
        );
    }
}

const mapStateToProps = state => {
    return {
        participantId: state['features/riff-platform'].signIn.user.uid,
        meeting: getSelectedMeeting(state),
        graphDataset: getMetricDataset(state, Interruptions.datasetType),
        datasetStatus: getDatasetStatus(state, Interruptions.datasetType)
    };
};

const mapDispatchToProps = dispatch => {
    return {
        dashboardGraphLoaded: graphType => dispatch(metricGraphLoaded(graphType))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Interruptions);
