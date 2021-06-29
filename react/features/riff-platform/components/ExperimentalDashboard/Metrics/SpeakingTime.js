/* eslint-disable jsdoc/require-description-complete-sentence */
/* eslint-disable jsdoc/require-hyphen-before-param-description */
/* eslint-disable valid-jsdoc */
/* ******************************************************************************
 * SpeakingTime.js                                                              *
 * *************************************************************************/ /**
 *
 * @fileoverview React component to visualize the distribution of speaking
 * time in a meeting.
 *
 * TODO: Tweak this component to be a generic pie chart to display any
 * categorical data. Instead of expecting an array of participants with
 * total utterance lengths, expect an array of the unexpected.
 *
 * Created on       October 28, 2019
 * @author          Brec Hanson
 *
 * @copyright (c) 2019-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import { GraphDatasetTypes, GraphTypes } from '@rifflearning/riff-metrics';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { ScaleLoader } from 'react-spinners';

import ChartCard from '../ChartCard/ChartCard';
import { Colors, getColorMap } from '../colorHelper';
import { GraphConfigs } from '../config';
import { formatDuration, getParticipantName } from '../functions';
import {
    RequestStatus,
    metricGraphLoaded,
    getSelectedMeeting,
    getMetricDataset,
    getDatasetStatus,
    logger
} from '../utils';

const logContext = 'SpeakingTime';

/* ******************************************************************************
  * SpeakingTime                                                            */ /**
  *
  * React component to visualize the distribution of speaking time in a meeting.
  *
  ********************************************************************************/
class SpeakingTime extends React.PureComponent {
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
    static graphType = GraphTypes.SPEAKING_TIME;

    /** The GraphDatasetType of the graphDataset property */
    static datasetType = GraphDatasetTypes.PARTICIPANT_INFO;

    /* **************************************************************************
     * constructor                                                         */ /**
     */
    constructor(props) {
        super(props);

        this.state = {
            updatedAt: null
        };

        this.chart = null;
        this.pieSeries = null;
    }

    /* **************************************************************************
     * componentDidMount                                                   */ /**
     */
    componentDidMount() {
        this.initGraph();
    }

    /* **************************************************************************
     * componentWillUnmount                                                */ /**
     */
    componentWillUnmount() {
        this.disposeChart();
    }

    /* **************************************************************************
     * componentDidUpdate                                                  */ /**
     */
    componentDidUpdate(prevProps, prevState) {
        const { isLoaded } = this.getDatasetStatus(prevProps);

        // If the dataset's current status is 'loaded', then draw graph
        if (isLoaded && this.state.updatedAt === prevState.updatedAt) {
            this.drawGraph();
        }
    }

    /* **************************************************************************
     * render                                                              */ /**
     *
     * Required method of a React component.
                                                                               *
     * @see {@link https://reactjs.org/docs/react-component.html#render|React.Component.render}
     */
    render() {
        logger.debug(`${logContext}.render: entered`, { props: this.props });

        // get the config for this graph type
        const config = GraphConfigs[SpeakingTime.graphType];
        const meetingId = this.props.meeting ? this.props.meeting._id : 'no-selected-meeting';
        const chartCardId = `cc-${meetingId}-${config.title.replace(' ', '-')}`;

        const { isLoaded } = this.getDatasetStatus();

        let emptyGraphText = null;
        const isGraphEmpty = this.props.graphDataset.participantStats.size === 0;

        if (isGraphEmpty) {
            emptyGraphText = <div className = 'empty-graph-text'>{config.empty}</div>;
        }

        let loadingDisplay = null;

        if (!isLoaded) {
            loadingDisplay = (
                <div className = 'loading-overlay'>
                    {<ScaleLoader color = { Colors.lightRoyal } />}
                </div>
            );
        }

        return (
            <ChartCard
                chartCardId = { chartCardId }
                chartInfo = { config.info }
                title = { config.title }>
                {loadingDisplay}
                {emptyGraphText}
                <div
                    className = { 'amcharts-graph-container speaking-time-graph-div' } />
            </ChartCard>
        );
    }

    /* ******************************************************************************
     * getGraphData                                                            */ /**
     *
     * For each participant in a meeting, create config objects for the pie chart.
     *
     * @returns Data items containing the prepared data for the graph.
     */
    getGraphData() {
        // sort participants by totalSecsUtterances
        const sortedParticipants = new Map([ ...this.props.graphDataset.participantStats.entries() ]
            .sort((a, b) => b[1].totalSecsUtterances - a[1].totalSecsUtterances));

        const selfData = [ this.props.participantId, {
            ...this.props.graphDataset.participantStats.get(this.props.participantId) || {},
            name: 'You',
            participant: 'You'
        } ];

        // remove for placing on the first place
        sortedParticipants.delete(this.props.participantId);

        const participantStatsGraphData = new Map([ selfData ].concat([ ...sortedParticipants ]));
        const sortedParticipantsIds = Array.from(participantStatsGraphData, ([ key ]) => key);
        const participantColors = getColorMap(sortedParticipantsIds, this.props.participantId);

        const graphData = [];

        for (const [ pid, stats ] of participantStatsGraphData) {
            const name = pid === this.props.participantId ? 'You' : getParticipantName(this.props.meeting, pid);
            const { color, level, textColor } = participantColors.get(pid) || {};

            graphData.push({
                name: name.split(' ')[0],
                participant: name,
                lengthUtterances: stats.totalSecsUtterances,
                color: am4core.color(color).brighten(level),
                textColor,
                tooltipText: `${name}: ${formatDuration(stats.totalSecsUtterances)}`
            });
        }

        logger.debug(`${logContext}.getGraphData: entered`, { graphData });

        return graphData;
    }

    /* ******************************************************************************
     * drawGraph                                                               */ /**
     *
     * Initialise the graph, add the categories, and populate with data.
     * - if an empty dataset is passed, return.
     *
     */
    drawGraph() {
        logger.debug(`${logContext}.drawGraph<${SpeakingTime.graphType}>: entered`);
        const chart = this.chart;

        const chartData = this.getGraphData();

        chart.data = chartData;

        // Is this component trying to visualise an empty dataset?
        const emptyDataset = chartData.length === 0;

        if (emptyDataset) {
            chart.hide();
            this.props.dashboardGraphLoaded(SpeakingTime.graphType);

            return;
        }

        chart.show();
    }

    /* ******************************************************************************
     * createSeries                                                            */ /**
     *
     * Create the graph series.
     *
     * For more info on amcharts PieSeries, see:
     * Https://www.amcharts.com/docs/v4/reference/pieseries/.
     *
     * @param chart - The chart object for this SpeakingTime.
     *
     * @returns The graph series for this graph type.
     */
    createSeries(chart) {
        const series = chart.series.push(new am4charts.PieSeries());

        series.dataFields.value = 'lengthUtterances';
        series.dataFields.category = 'participant';
        series.padding = 0;

        const slices = series.slices.template;

        slices.propertyFields.fill = 'color';
        slices.cornerRadius = 1;
        slices.tooltipText = '{tooltipText}';

        slices.strokeWidth = 0;
        slices.strokeOpacity = 0;
        slices.states.getKey('active').properties.shiftRadius = 0; // remove this default animation

        const rgm = new am4core.LinearGradientModifier();

        rgm.brightnesses.push(0, -0.07, -0.18);
        slices.fillModifier = rgm;

        series.labels.labelText = '{name}';
        series.ticks.template.disabled = true;
        series.labels.textAlign = 'middle';
        series.alignLabels = false;

        const labels = series.labels.template;

        labels.fill = am4core.color(Colors.white);
        labels.text = '[font-weight: 600 text-transform: uppercase]{name}\n{value.percent.formatNumber(\'#.0\')}%[/]';
        labels.padding(0, 0, 0, 0);
        labels.fontSize = 10;
        labels.maxWidth = 55;
        labels.truncate = true;
        labels.radius = am4core.percent(-45);

        labels.adapter.add('radius', (radius, target) => {
            if (target.dataItem && target.dataItem.values.value.percent < 10) {
                target.fill = am4core.color(Colors.mineShaft);

                return 4;
            }

            return radius;
        });

        labels.adapter.add('fill', (fill, target) => {
            if (target.dataItem && target.dataItem._dataContext.textColor) {
                return am4core.color(target.dataItem._dataContext.textColor);
            }

            return fill;
        });

        labels.adapter.add('disabled', (disabled, target) => {
            if (target.dataItem && target.dataItem.values.value.percent < 5) {
                return true;
            }

            return false;
        });

        return series;

    }

    /* ******************************************************************************
     * initGraph                                                               */ /**
     *
     * Initialise the chart and bind to the appropriate html element.
     *
     * For more info on amcharts PieChart, see:
     * Https://www.amcharts.com/docs/v4/reference/PieChart/
     * https://www.amcharts.com/docs/v4/chart-types/pie-chart/.
     *
     * @returns {Object} Containing a reference to the chart.
     */
    initGraph() {
        logger.debug(`${logContext}.initGraph<${SpeakingTime.graphType}>: entered`);

        // Hide am-charts logo (paid version)
        am4core.options.commercialLicense = true;

        // Create chart and place it inside the html element with id speaking-time-graph-div
        const chart = am4core.create('speaking-time-graph-div', am4charts.PieChart);

        chart.background.fill = am4core.color(Colors.white);
        chart.numberFormatter.numberFormat = '##.#';
        chart.radius = new am4core.Percent(85);

        // Fired when graph's data gets updated
        chart.events.on('datavalidated', () => {
            this.props.dashboardGraphLoaded(SpeakingTime.graphType);
        });

        // Create pie graph series
        // Disable lint because this variable might be useful in future
        // eslint-disable-next-line no-unused-vars
        const pieSeries = this.createSeries(chart);

        this.chart = chart;
        this.pieSeries = pieSeries;

        return chart;
    }

    /* ******************************************************************************
     * disposeChart                                                            */ /**
     *
     * This is called when it is appropriate to dispose of the chart, for efficiency.
     */
    disposeChart() {
        if (this.chart) {
            this.chart.dispose();
            this.chart = null;
            logger.debug(`${logContext}.disposeChart<${SpeakingTime.graphType}>: disposed of chart`);
        }
    }

    /* ******************************************************************************
     * getDatasetStatus                                                        */ /**
     *
     * Check if the dataset passed in this.props.graphDataset is loaded.
     *
     * @param {object} prevProps Optional, containing the previous props.
     *
     * @returns {object} containing three booleans:
     *      1. wasLoading  - Was the dataset previously loading?
     *      2. isLoaded   - Is the dataset loaded?
     *      3. loadingNewData - Is new data being fetched?
     */
    getDatasetStatus(prevProps) {
        const isLoaded = this.props.datasetStatus === RequestStatus.SUCCESS;

        let wasLoaded = true;
        let wasLoading = false;

        if (prevProps) {
            wasLoading = prevProps.datasetStatus === RequestStatus.STARTED
                || prevProps.datasetStatus === RequestStatus.NOT_STARTED;
            wasLoaded = prevProps.datasetStatus === RequestStatus.SUCCESS;
        }

        const loadingNewData = wasLoaded && !isLoaded;

        return { wasLoading,
            isLoaded,
            loadingNewData };
    }
}

const mapStateToProps = state => {
    return {
        participantId: state['features/riff-platform'].signIn.user.uid,
        meeting: getSelectedMeeting(state),
        graphDataset: getMetricDataset(state, SpeakingTime.datasetType),
        datasetStatus: getDatasetStatus(state, SpeakingTime.datasetType)
    };
};

const mapDispatchToProps = dispatch => {
    return {
        dashboardGraphLoaded: graphType => dispatch(metricGraphLoaded(graphType))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SpeakingTime);
