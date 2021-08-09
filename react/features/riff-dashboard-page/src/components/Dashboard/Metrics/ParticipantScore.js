/* ******************************************************************************
 * ParticipantScore.js                                                          *
 * *************************************************************************/ /**
 *
 * @fileoverview React component to visualize a participant's score in a meeting
 *
 * TODO: Tweak this component to be a generic bullet chart to display any
 * one dimensional data.
 *
 * Created on       December 1, 2019
 * @author          Brec Hanson
 *
 * @copyright (c) 2019-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import React from 'react';
import PropTypes from 'prop-types';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';

import { ScaleLoader } from 'react-spinners';

import {
    Colors,
    getDurationInSeconds,
    logger,
} from 'libs/utils';

import {
    EStatus,
    GraphConfigs,
    GraphDatasetTypes,
    GraphTypes,
} from 'libs/utils/constants';

import { ChartCard } from './ChartCard';

/* ******************************************************************************
 * ParticipantScore                                                        */ /**
 ********************************************************************************/
class ParticipantScore extends React.Component {
    static propTypes = {
        /** meeting whose relevant data will be in graphDataset */
        meeting: PropTypes.shape({
            _id: PropTypes.string.isRequired,
            participants: PropTypes.instanceOf(Set).isRequired,
        }),

        /** ID of the logged in user so their data can be distinguished */
        participantId: PropTypes.string.isRequired,

        /** All of the graph datasets defined in constants/Graphs (GraphDatasets)
         *  - the keys of this object are defined in constants/Graphs (GraphDatasets)
         *
         */
        graphDatasets: PropTypes.objectOf(
            PropTypes.shape({
                data: PropTypes.oneOfType([
                    PropTypes.object,
                    PropTypes.array,
                ]),
                status: PropTypes.oneOf(Object.values(EStatus)).isRequired,
            })
        ).isRequired,

        /** A unique graph type for this graphs
         *  - used for fetching configs for this graph
         *  - the potential graph types are defined in constants/Graphs (GraphTypes)
         */
        graphType: PropTypes.oneOf(Object.values(GraphTypes)).isRequired,

        /** sets a graphical rendering status for a graph type to loaded */
        dashboardGraphLoaded: PropTypes.func.isRequired,
    };

    /* **************************************************************************
     * constructor                                                         */ /**
     */
    constructor(props) {
        super(props);

        this.chart = null;
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
    componentDidUpdate(prevProps) {
        const { allAreLoaded } = this.getDatasetStatus({
            prevProps,
            currentProps: this.props,
        });

        // If one of the dataset's previous status was 'loading',
        // and all of the dataset's current status is 'loaded', then draw graph
        if (allAreLoaded) {
            logger.debug('ParticipantScore.didUpdate: drawing graph', this.props);
            this.drawGraph();
        }
    }

    /* **************************************************************************
     * shouldComponentUpdate                                               */ /**
     *
     */
    shouldComponentUpdate(nextProps) {
        const { allAreLoaded, allWereLoaded } = this.getDatasetStatus({
            prevProps: this.props,
            currentProps: nextProps,
        });

        // Since this component is subscribed to multiple datasets in the
        // Metrics index, it would re-render when each dataset loads.
        // We only want to re-render if all of the datasets are loaded.
        if (!allWereLoaded && !allAreLoaded) {
            return false;
        }

        return true;
    }

    /* **************************************************************************
     * render                                                              */ /**
     *
     * Required method of a React component.
     * @see {@link https://reactjs.org/docs/react-component.html#render|React.Component.render}
     */
    render() {
        // get the config for this graph type
        const config = GraphConfigs[this.props.graphType];
        const meetingId = this.props.meeting ? this.props.meeting._id : 'no-selected-meeting';
        const chartCardId = `cc-${meetingId}-${config.title.replace(' ', '-')}`;

        const { allAreLoaded } = this.getDatasetStatus({
            currentProps: this.props,
        });

        let emptyGraphText;
        const timelineData = this.props.graphDatasets[GraphDatasetTypes.UTTERANCE_TIMELINE].data;

        // If there are no utts in the meeting, there are no events, and thus, no graph data
        if (timelineData && timelineData.utts.length === 0) {
            emptyGraphText = <div className='empty-graph-text'>{config.empty}</div>;
        }

        let loadingDisplay = null;
        if (!allAreLoaded) {
            loadingDisplay = (
                <div className='loading-overlay'>
                    {<ScaleLoader color={Colors.lightRoyal}/>}
                </div>
            );
        }

        return (
            <ChartCard
                title={config.title}
                chartInfo={config.info}
                chartCardId={chartCardId}
            >
                {loadingDisplay}
                {emptyGraphText}
                <div className={'amcharts-graph-container participant-score-graph-div'}/>
            </ChartCard>
        );
    }

    /* ******************************************************************************
     * getInfluenceScore                                                       */ /**
     *
     * Returns the influence score for a meeting
     *
     * Formula:
     * 10 * (# influences of others)/(length of meeting in minutes)/6
     *
     * @param {number} meetingLengthMinutes - the meeting length in minutes
     *
     * @returns {number} the participant's influence score
     */
    getInfluenceScore(meetingLengthMinutes) {
        let influenceScore = 0;
        const myInfluences = GraphConfigs[GraphTypes.MY_INFLUENCE].eventsFilter(
            this.props.graphDatasets[GraphDatasetTypes.INFLUENCES].data.events,
            this.props.participantId
        );

        influenceScore = 10 * myInfluences.length / meetingLengthMinutes / 6;

        logger.debug('ParticipantScore: getInfluenceScore:', { influenceScore, meetingLengthMinutes });
        return influenceScore;
    }

    /* ******************************************************************************
     * getInterruptionsScore                                                   */ /**
     *
     * Returns the interruption score for a meeting
     *
     * Formula:
     * 10 ^ (1 - interruptions per minute)
     *
     * @param {number} meetingLengthMinutes - the meeting length in minutes
     *
     * @returns {number} the participant's interruption score
     */
    getInterruptionsScore(meetingLengthMinutes) {
        let interruptionsScore = 0;
        const myInterruptions = GraphConfigs[GraphTypes.MY_INTERRUPTIONS].eventsFilter(
            this.props.graphDatasets[GraphDatasetTypes.INTERRUPTIONS].data.events,
            this.props.participantId
        );

        interruptionsScore = Math.pow(10, 1 - (myInterruptions.length / meetingLengthMinutes));

        logger.debug('ParticipantScore: getInterruptionsScore:', { myInterruptions, interruptionsScore });
        return interruptionsScore;
    }

    /* ******************************************************************************
     * getSpeakingTimeScore                                                    */ /**
     *
     * Returns the speaking time score for a meeting
     *
     * Formula:
     * 10 *(1 - (% of time user spent speaking - 1/(# Participants)^2)
     * /
     * (# participants - 1 / # participants)^2)
     *
     * @param {number} meetingLengthMinutes - the meeting length in minutes
     * @param {number} uttsLengthMinutes - user's total utts length in minutes
     * @param {number} numOfParticipants - number of participants in the meeting
     *
     * @returns {number} the participant's speaking time score
     */
    getSpeakingTimeScore(meetingLengthMinutes, uttsLengthMinutes, numOfParticipants) {
        let speakingTimeScore = 0;

        const speakingTimePercentage = uttsLengthMinutes / meetingLengthMinutes;

        speakingTimeScore = 10 * (
            1 - Math.pow(speakingTimePercentage - 1 / numOfParticipants, 2)
            /
            Math.pow(numOfParticipants - 1 / numOfParticipants, 2)
        );

        logger.debug('ParticipantScore: getSpeakingTimeScore:',
                     {
                         numOfParticipants,
                         uttsLengthMinutes,
                         speakingTimePercentage,
                         speakingTimeScore
                     }
        );
        return speakingTimeScore;
    }

    /* ******************************************************************************
     * getTurnScore                                                            */ /**
     *
     * Returns the turn score for a meeting
     *
     * Formula:
     * 10 * (1- abs((# turns taken by participant)/(total turns)
     * - (1/(#participants))/(#participants - 1)/(#participants))
     *
     * @param {number} numOfParticipants - number of participants in the meeting
     * @param {Array} sortedUtterances - all utts from the meeting sorted by start time
     *
     * @returns {number} the participant's turn score
     */
    getTurnScore(numOfParticipants, sortedUtterances) {
        // First utt is a turn
        let totalTurns = 1;

        // Was the first utt the current user's?
        let userTurns = sortedUtterances[0].participant === this.props.participantId ? 1 : 0;

        // For every utterance, see if the current utt's participant is different from the previous utt's.
        // This indicates a turn. Check if the turn was by the current user.
        sortedUtterances.forEach((utt, index) => {
            if (index !== 0 && utt.participant !== sortedUtterances[index - 1].participant) {
                totalTurns++;

                if (utt.participant === this.props.participantId) {
                    userTurns++;
                }
            }
        });

        const turnScore = 10 * (
            1 - Math.abs(userTurns / totalTurns - 1 / numOfParticipants) / ((numOfParticipants - 1) / numOfParticipants)
        );

        logger.debug('ParticipantScore: getTurnScore:',
                     {
                         numOfParticipants,
                         sortedUtterances,
                         totalTurns,
                         userTurns,
                         turnScore
                     });
        return turnScore;
    }

    /* ******************************************************************************
     * getGraphData                                                            */ /**
     *
     * get the participant score for this meeting
     *
     * @returns {Array} containing the prepared data for the graph
     */
    getGraphData() {
        const timelineData = this.props.graphDatasets[GraphDatasetTypes.UTTERANCE_TIMELINE].data;
        const meetingLengthMinutes = getDurationInSeconds(timelineData.startTime, timelineData.endTime) / 60;

        const meetingStats = this.props.graphDatasets[GraphDatasetTypes.MEETING_STATS].data;
        const numOfParticipants = meetingStats.length;

        // find returns undefined if there is no element that meets the condition
        // so if participantStats will be undefined if the user did not speak at all
        const participantStats = meetingStats.find((participant) => {
            return participant.participantId === this.props.participantId;
        });

        // if a user did not participate in the meeting at all, obviously they get a zero
        if (participantStats === undefined) {
            return [{
                category: 'ParticipantScore',
                score: 0,
            }];
        }

        // Get user's total utterance length in minutes (participant.lengthUtterances is in seconds)
        const uttsLengthMinutes = participantStats.lengthUtterances / 60;

        let finalScore = 0;

        const scores = {
            influence: this.getInfluenceScore(meetingLengthMinutes),
            interruption: this.getInterruptionsScore(meetingLengthMinutes),
            speakingTime: this.getSpeakingTimeScore(meetingLengthMinutes, uttsLengthMinutes, numOfParticipants),
            turnScore: this.getTurnScore(numOfParticipants, timelineData.sortedUtterances),
        };

        // Add all scores to finalScore
        Object.values(scores).forEach(score => finalScore += score);

        // Divide by number of scores used
        finalScore = finalScore / Object.keys(scores).length;

        // Round to 2 decimal places
        finalScore = Math.round(finalScore * 100) / 100;

        logger.debug('ParticipantScore: getGraphData:', { scores, finalScore });

        // Graph data for the horizontal column representing the participant score
        return [{
            category: 'ParticipantScore',
            score: finalScore,
        }];
    }

    /* ******************************************************************************
     * drawGraph                                                               */ /**
     *
     * Calculate the participant's score for a meeting and add data to graph
     *
     */
    drawGraph() {
        logger.debug('ParticipantScore: drawGraph', this.props.graphType);
        const chart = this.chart;

        const timelineData = this.props.graphDatasets[GraphDatasetTypes.UTTERANCE_TIMELINE].data;
        logger.debug('ParticipantScore: timelineData', { timelineData });

        // Is this component trying to visualise an empty dataset?
        const emptyDataset = timelineData.utts.length === 0;
        if (emptyDataset) {
            chart.hide();
            this.props.dashboardGraphLoaded(this.props.graphType);
            return;
        }
        chart.show();

        const chartData = this.getGraphData();
        chart.data = chartData;
    }

    /* ******************************************************************************
     * createGraphSeries                                                       */ /**
     *
     * Create the series for this graph.
     *
     * The gradient background is a column series, and the line indicating the
     * participant score is a line series.
     *
     * For more info on the amcharts series used in this graph, see:
     * https://www.amcharts.com/docs/v4/reference/columnseries/
     * https://www.amcharts.com/docs/v4/reference/lineseries/
     *
     * @param {object} chart - the chart object for this ParticipantScore
     *
     * @returns {object} containing both of the graph series for this graph
     */
    createGraphSeries(chart) {
        const gradientSeries = chart.series.push(new am4charts.ColumnSeries());
        gradientSeries.dataFields.valueX = 'score';
        gradientSeries.dataFields.categoryY = 'category';
        gradientSeries.columns.template.fill = am4core.color(Colors.lightAnchor);
        gradientSeries.columns.template.stroke = am4core.color(Colors.lightAnchor);
        gradientSeries.columns.template.strokeWidth = 1;
        gradientSeries.columns.template.strokeOpacity = 0.5;
        gradientSeries.columns.template.height = am4core.percent(25);
        gradientSeries.columns.template.tooltipText = 'Your score: [bold]{score}[/]';

        return gradientSeries;
    }

    /* ******************************************************************************
     * createYAxis                                                             */ /**
     *
     * Create the y-axis for the graph
     *
     * For info on amcharts CategoryAxis, view:
     * https://www.amcharts.com/docs/v4/reference/categoryaxis/
     * https://www.amcharts.com/docs/v4/concepts/axes/category-axis/
     *
     * @param {object} chart - the chart object for this graph
     *
     * @returns {object} containing the x-axis for the graph
     */
    createYAxis(chart) {
        const categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = 'category';
        categoryAxis.renderer.minGridDistance = 30;
        categoryAxis.renderer.line.strokeWidth = 0;
        categoryAxis.renderer.grid.template.disabled = true;
        categoryAxis.renderer.labels.template.disabled = true;

        return categoryAxis;
    }

    /* ******************************************************************************
     * createXAxis                                                             */ /**
     *
     * Create the x-axis for the graph
     *
     * @param {object} chart - the chart object for this graph
     *
     * @returns {object} containing the y-axis for the graph
     */
    createXAxis(chart) {
        const valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.minGridDistance = 30;
        valueAxis.renderer.grid.template.disabled = true;
        valueAxis.min = 0;
        valueAxis.max = 10;
        valueAxis.strictMinMax = true;

        /*
         * In order to create a gradient background, only one axisRange object is needed
         * and a gradient object can be assigned to the axisRange's fill property.
         */
        const gradient = new am4core.LinearGradient();
        const colors = [ Colors.purpleWhite, Colors.brightPlum ];
        for (const color of colors) {
            // add each color that makes up the gradient
            gradient.addColor(am4core.color(color));
        }

        const range = valueAxis.axisRanges.create();
        range.value = 0;
        range.endValue = 100;
        range.axisFill.fill = gradient;
        range.axisFill.fillOpacity = 0.8;
        range.label.disabled = true;
        range.grid.disabled = true;

        return valueAxis;
    }

    /* ******************************************************************************
     * initGraph                                                               */ /**
     *
     * Initialise the chart and bind to the appropriate html element.
     *
     * For more info on amcharts BulletChart (technically XY chart), see:
     * https://www.amcharts.com/docs/v4/tutorials/creating-a-bullet-chart/
     * https://www.amcharts.com/docs/v4/reference/XYChart/
     * https://www.amcharts.com/docs/v4/chart-types/xy-chart/
     *
     * @returns {object} containing a reference to the chart
     */
    initGraph() {
        logger.debug('ParticipantScore.initGraph', this.props.graphType);

        // Hide am-charts logo (paid version)
        am4core.options.commercialLicense = true;

        // Create chart and place it inside the html element with id participant-score-graph-div
        const chart = am4core.create('participant-score-graph-div', am4charts.XYChart);
        chart.background.fill = Colors.selago;
        chart.paddingRight = 25;

        // Create categoryAxis axis
        // Disable lint because this variable might be useful in future
        // eslint-disable-next-line no-unused-vars
        const categoryAxis = this.createYAxis(chart);

        // Create valueAxis axis
        // Disable lint because this variable might be useful in future
        // eslint-disable-next-line no-unused-vars
        const valueAxis = this.createXAxis(chart);

        // Create gradient and line series for this graph
        // Disable lint because this variable might be useful in future
        // eslint-disable-next-line no-unused-vars
        const gradientSeries = this.createGraphSeries(chart);

        // Fired when graph's data gets updated
        chart.events.on('datavalidated', () => {
            this.props.dashboardGraphLoaded(this.props.graphType);
        });

        this.chart = chart;
        return chart;
    }

    /* ******************************************************************************
     * disposeChart                                                            */ /**
     *
     * This is called when it is appropriate to dispose of the chart, for efficiency.
     *
     */
    disposeChart() {
        if (this.chart) {
            this.chart.dispose();
            this.chart = null;
            logger.debug(`ParticipantScore: disposed of chart - ${this.props.graphType}`);
        }
    }

    /* ******************************************************************************
     * getDatasetStatus                                                        */ /**
     *
     * Check if all of the datasets passed in this.props.graphDatasets are loaded.
     *
     * @param {object} prevProps - optional, containing the previous props
     * @param {object} currentProps - containing the current or next props
     *
     * @returns {object} containing three booleans:
     *      1. oneWasLoading  - Was one of the datasets previously loading?
     *      2. allAreLoaded   - Are all the datasets loaded?
     *      3. loadingNewData - Is new data being fetched?
     */
    getDatasetStatus({ prevProps, currentProps }) {
        let oneWasLoading = false;
        let allAreLoaded = true;
        let allWereLoaded = true;

        Object.keys(currentProps.graphDatasets).map((graphDatasets) => {
            if (prevProps && prevProps.graphDatasets[graphDatasets].status === EStatus.LOADING) {
                oneWasLoading = true;
            }
            if (prevProps && prevProps.graphDatasets[graphDatasets].status !== EStatus.LOADED) {
                allWereLoaded = false;
            }
            if (currentProps.graphDatasets[graphDatasets].status === EStatus.LOADING) {
                allAreLoaded = false;
            }
        });

        return { oneWasLoading, allAreLoaded, allWereLoaded };
    }
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    ParticipantScore,
};
