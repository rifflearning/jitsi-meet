/* eslint-disable valid-jsdoc */
/* ******************************************************************************
 * Influence.js                                                                *
 * *************************************************************************/ /**
 *
 * @fileoverview React component to visualize the influence of and to
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
 * Influence                                                               */ /**
 *
 * React component to visualize the influence of/to a participant in a meeting.
 *
 ********************************************************************************/
class Influence extends React.PureComponent {
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
    static graphType = GraphTypes.GROUPED_INFLUENCES;

    /** The GraphDatasetType of the graphDataset property */
    static datasetType = GraphDatasetTypes.INFLUENCES;

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
                graphType = { Influence.graphType }
                stackedEventTypes = { [
                    EventTypes.MY_INFLUENCE,
                    EventTypes.THEIR_INFLUENCE
                ] }
                { ...this.props } />
        );
    }
}

const mapStateToProps = state => {
    return {
        participantId: state['features/riff-platform'].signIn.user.uid,
        meeting: getSelectedMeeting(state),
        graphDataset: getMetricDataset(state, Influence.datasetType),
        datasetStatus: getDatasetStatus(state, Influence.datasetType)
    };
};

const mapDispatchToProps = dispatch => {
    return {
        dashboardGraphLoaded: graphType => dispatch(metricGraphLoaded(graphType))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Influence);
