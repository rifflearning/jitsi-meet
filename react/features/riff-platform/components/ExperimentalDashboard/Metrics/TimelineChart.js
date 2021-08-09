/* eslint-disable no-negated-condition */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable jsdoc/require-description-complete-sentence */
/* eslint-disable valid-jsdoc */
/* ******************************************************************************
 * TimelineChart.js                                                             *
 * *************************************************************************/ /**
*
* @fileoverview React component to visualize meeting speaking timelines and
* interaction events
*
* Created on       October 28, 2019
* @author          Brec Hanson
*
* @copyright (c) 2018-present Riff Learning Inc.,
*            MIT License (see https://opensource.org/licenses/MIT)
*
* ******************************************************************************/

import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import { GraphDatasetTypes, GraphTypes } from '@rifflearning/riff-metrics';
import * as d3 from 'd3-time-format';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { ScaleLoader } from 'react-spinners';
import { createSelector } from 'reselect';

import ChartCard from '../ChartCard/ChartCard';
import {
    Colors,
    getColorMap
} from '../colorHelper';
import {
    GraphConfigs, EventTypes, EventConfigs
} from '../config';
import {
    formatDuration,
    getDurationInSeconds
} from '../functions';
import {
    RequestStatus,
    metricGraphLoaded,
    getSelectedMeeting,
    getMetricDataset,
    getDatasetStatus,
    logger
} from '../utils';

import SpeakingTime from './SpeakingTime';

const logContext = 'Timeline';

/* ******************************************************************************
 * TimelineChart                                                           */ /**
 *
 * React component to visualize the speaking timeline for each participant in a
 * meeting. It also shows when critical events in the meeting involving you and
 * other participants took place.
 *
 ********************************************************************************/
class TimelineChart extends React.Component {
    static propTypes = {
        /** Sets a graphical rendering status for a graph type to loaded */
        dashboardGraphLoaded: PropTypes.func.isRequired,

        /** The request status of the graphDataset */
        datasetStatus: PropTypes.string.isRequired,

        /** All of the datasets required by the overlay event types for this graph */
        eventDatasetStatuses: PropTypes.any.isRequired,

        /** The request status of the eventDatasets */
        eventDatasets: PropTypes.any.isRequired,

        /** The main dataset that is used for this graph */
        graphDataset: PropTypes.object.isRequired,

        /** Meeting whose relevant data will be in graphDataset */
        meeting: PropTypes.shape({
            _id: PropTypes.string.isRequired,
            participants: PropTypes.instanceOf(Map).isRequired
        }),

        /** ID of the logged in user so their data can be distinguished */
        participantId: PropTypes.string.isRequired,

        /** The participant info dataset that is used for correct chart colors */
        participantsStatsData: PropTypes.object.isRequired
    };

    /** The GraphType of this component */
    static graphType = GraphTypes.TIMELINE;

    /** The GraphDatasetType of the graphDataset property */
    static datasetType = GraphDatasetTypes.UTTERANCE_TIMELINE;

    static overlayEventTypes = [
        EventTypes.MY_INTERRUPTIONS,
        EventTypes.THEIR_INTERRUPTIONS,
        EventTypes.MY_AFFIRMATIONS,
        EventTypes.THEIR_AFFIRMATIONS,
        EventTypes.MY_INFLUENCE,
        EventTypes.THEIR_INFLUENCE
    ];

    /* **************************************************************************
     * constructor                                                         */ /**
     */
    constructor(props) {
        super(props);

        this.state = {
            updatedAt: null
        };

        this.chart = null;
        this.eventsDatasets = {};
        this.categoryAxis = {};
        this.dateAxis = {};
        this.participantSeries = {};
        this.eventsSeries = [];
        this.legend = {};
    }

    /* **************************************************************************
     * componentDidMount                                                   */ /**
     *
     */
    componentDidMount() {
        this.initGraph();
    }

    /* **************************************************************************
     * componentWillUnmount                                                */ /**
     *
     */
    componentWillUnmount() {
        this.disposeChart();
        this.chart = null;
        logger.debug(`${logContext}.willUnmount: disposed of chart`);
    }

    /* **************************************************************************
     * componentDidUpdate                                                  */ /**
     *
     */
    componentDidUpdate(prevProps, prevState) {
        const { allAreLoaded } = this.getDatasetStatus({
            prevProps,
            currentProps: this.props
        });

        // If one of the dataset's previous status was 'loading',
        // and all of the dataset's current status is 'loaded', then draw graph
        if (allAreLoaded && this.state.updatedAt === prevState.updatedAt) {
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
            currentProps: nextProps
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
     * Required method of a React component.                                                                           *

     * @see {@link https://reactjs.org/docs/react-component.html#render|React.Component.render}
     */
    render() {
        logger.debug('TimelinePlot: render');

        // get the config for this graph type
        const config = GraphConfigs[TimelineChart.graphType];
        const meetingId = this.props.meeting ? this.props.meeting._id : 'no-selected-meeting';
        const chartCardId = `cc-${meetingId}-${config.title.replace(' ', '-')}`;

        const { allAreLoaded } = this.getDatasetStatus({
            currentProps: this.props
        });

        let emptyGraphText;
        const timelineData = this.props.graphDataset;

        // If there are no utts in the meeting, there are no events, and thus, no graph data
        if (timelineData.utterances.length === 0) {
            emptyGraphText = <div className = 'empty-graph-text'>{config.empty}</div>;
        }

        let loadingDisplay = null;

        if (!allAreLoaded) {
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
                    className = 'amcharts-graph-container timeline-plot-div' />
            </ChartCard>
        );
    }

    /* ******************************************************************************
     * initGraph                                                               */ /**
     *
     * Initialise the chart and bind to the appropriate html element.
     *
     * For more info on amcharts XYChart, see:
     * Https://www.amcharts.com/docs/v4/reference/XYChart/
     * https://www.amcharts.com/docs/v4/chart-types/xy-chart/.
     *
     * @returns {Object} Containing a reference to the chart.
     */
    initGraph() {
        // Hide am-charts logo (paid version)
        am4core.options.commercialLicense = true;

        // Create chart and place it inside the html element with id timeline-plot-div
        const chart = am4core.create('timeline-plot-div', am4charts.XYChart);

        chart.background.fill = am4core.color(Colors.white);

        // Create dateAxis axis
        const dateAxis = this.createXAxis(chart);

        this.dateAxis = dateAxis;

        // Create categoryAxis axis
        const categoryAxis = this.createYAxis(chart);

        this.categoryAxis = categoryAxis;

        // Add the speaking timeline for each participant in the meeting
        const participantSeries = this.createParticipantSeries(chart);

        this.participantSeries = participantSeries;

        // Add each event series
        const eventsSeries = this.createAllEventSeries(chart);

        this.eventsSeries = eventsSeries;

        this.createLegend(chart);

        this.chart = chart;

        return chart;
    }

    /* ******************************************************************************
     * drawGraph                                                               */ /**
     *
     * Initialise the graph, add the axes, and populate with data.
     *
     */
    drawGraph() {
        // Force each series in the chart to refresh its data
        // this.eventsSeries.forEach(series => series.invalidateData());
        // this.participantSeries.invalidateData();
        logger.debug(`${logContext}.drawGraph:`, { props: this.props });

        if (this.chart === null || this.dateAxis === null || this.categoryAxis === null) {
            const errmsg = `${logContext}.drawGraph: LogicError: drawGraph called before initGraph`;

            logger.error(errmsg, { chart: this.chart,
                dateAxis: this.dateAxis,
                categoryAxis: this.categoryAxis });
            throw new Error(errmsg);
        }
        const chart = this.chart;

        const timelineData = this.props.graphDataset;

        logger.debug('TimelinePlot: timelineData', { timelineData });

        // Is this component trying to visualise an empty dataset?
        const emptyDataset = timelineData.utterances.length === 0;

        if (emptyDataset) {
            chart.hide();
            this.props.dashboardGraphLoaded(TimelineChart.graphType);

            return;
        }
        chart.show();

        // get the meeting participants and sort them ascending by id
        const participants = Array.from(this.props.meeting.participants.values())
         // eslint-disable-next-line no-confusing-arrow
         .sort((p1, p2) => p1.id < p2.id ? -1 : p1.id === p2.id ? 0 : 1);

        // Get participant names, renaming duplicates
        const participantNames = getUniqueParticipantNameMap(participants, this.props.participantId);

        // Set x-axis min and max
        this.dateAxis.min = timelineData.utterancesStart.getTime();
        this.dateAxis.max = timelineData.utterancesEnd.getTime();

        // Generate y-axis categories
        this.categoryAxis.data = this.generateYAxisCategories(participantNames, TimelineChart.overlayEventTypes);

        // Add data to the participant column series, which represents the speaking timeline
        // for each participant
        this.addParticipantData(participantNames, timelineData);

        // Add data to each events series
        this.addEventsData(participantNames);

        // Add horizontal scrollbar
        chart.scrollbarX = new am4core.Scrollbar();

        // Add chart cursor
        chart.cursor = new am4charts.XYCursor();
        chart.cursor.behavior = 'zoomX';
        chart.cursor.lineY.disabled = true;
    }

    /* ******************************************************************************
     * addEventsData                                                           */ /**
     *
     * Map over the event types and add the data to the respective graph series.
     *
     * @param participantNames - the names of each participant in the meeting
     * @returns {Object} Containing the event data for each GraphType.
     */
    addEventsData(participantNames) {
        for (const eventSeries of this.eventsSeries) {
            const eventType = eventSeries.eventType;
            const eventConfig = EventConfigs[eventType];
            const baseEventDatum = {
                name: eventConfig.legendLabel,
                categoryY: eventConfig.whatIsCounted,
                color: eventConfig.color,
                eventType
            };
            const events = eventConfig.eventsFilter(
                this.props.eventDatasets[eventConfig.datasetType].relatedUtterances,
                this.props.participantId,
            );

            // Set noData and data properties for this event series
            eventSeries.noData = events.length === 0;

            // For toggled off item legend style
            events.length === 0 ? eventSeries.hide() : eventSeries.show();

            // eventSeries.template.cursorOverStyle = am4core.MouseCursorStyle.default;

            eventSeries.data = events.map(event => {
                return {
                    noData: events.length === 0,
                    ...baseEventDatum,
                    dateTime: new Date(eventConfig.getEventTime(event)),
                    tooltip: eventConfig.getTimelineTooltip({
                        source: participantNames[eventConfig.getSourceParticipant(event)],
                        target: participantNames[eventConfig.getTargetParticipant(event)],
                        eventTime: this.formatTime(eventConfig.getEventTime(event))
                    })
                };
            });
        }
    }

    /* ******************************************************************************
     * createAllEventSeries                                                    */ /**
     *
     * Map over the event types and create an amcharts graph series for each.
     *
     * @param {Object} chart - The chart object for the TimelinePlot.
     *
     * @returns {array} Containing the graph series for each GraphType.
     */
    createAllEventSeries(chart) {
        const eventsSeries = TimelineChart.overlayEventTypes
            .map(eventType => this.createEventSeries(eventType));

        // chart.series is NOT an array, push method only takes 1 argument
        eventsSeries.forEach(eventSeries => chart.series.push(eventSeries));

        return eventsSeries;
    }

    /* ******************************************************************************
     * addParticipantData                                                      */ /**
     *
     * Map over all utterances and populate participant speaking time columns.
     *
     * For more info on amcharts ColumnSeries, see:
     * Https://www.amcharts.com/docs/v4/reference/columnseries/.
     *
     * @param {Map} participantNames - The names of each participant in the meeting.
     * @param {Object} timelineData - The timeline data for a meeting.
     */
    addParticipantData(participantNames, timelineData) {
        // sorted participants ids are required for generating correct participants colors
        const sortedParticipants = new Map([ ...this.props.participantsStatsData.participantStats.entries() ]
        .sort((a, b) => b[1].totalSecsUtterances - a[1].totalSecsUtterances));

        const participantColors = getColorMap(Array.from(sortedParticipants,
            ([ key ]) => key), this.props.participantId);

        const participantSeriesData = timelineData.utterances.map(utt => {
            const { color, level } = participantColors.get(utt.participantId) || {};

            const name = participantNames[utt.participantId];

            return {
                name,
                categoryY: name,
                fromDate: utt.start,
                toDate: utt.end,
                color: am4core.color(color).brighten(level),
                tooltipHTML: this.getUttTooltip(utt.start, utt.end, name)
            };
        });

        this.participantSeries.data = participantSeriesData;
    }

    /* ******************************************************************************
     * createParticipantSeries                                                 */ /**
     *
     * Create the column series that will be used to represent the speaking timeline
     * for participants in a meeting.
     *
     * For more info on amcharts ColumnSeries, see:
     * Https://www.amcharts.com/docs/v4/reference/columnseries/.
     *
     * @param {Object} chart - The chart object for the TimelinePlot.
     *
     * @returns {Object} Containing the graph series config for each GraphType.
     */
    createParticipantSeries(chart) {
        const participantSeries = chart.series.push(new am4charts.ColumnSeries());

        participantSeries.dateFormatter = new am4core.DateFormatter();
        participantSeries.dateFormatter.dateFormat = 'hh:mm:ss';
        participantSeries.columns.template.tooltipHTML = '{tooltipHTML}';
        participantSeries.cursorTooltipEnabled = true;
        participantSeries.dataFields.openDateX = 'fromDate';
        participantSeries.dataFields.dateX = 'toDate';
        participantSeries.dataFields.categoryY = 'name';
        participantSeries.columns.template.propertyFields.fill = 'color'; // get color from data
        participantSeries.columns.template.propertyFields.stroke = 'color';
        participantSeries.columns.template.strokeOpacity = 1;
        participantSeries.hiddenInLegend = true; // No legend items for other participants utt's
        participantSeries.columns.template.height = am4core.percent(60); // height of horizontal columns

        const rgm = new am4core.LinearGradientModifier();

        rgm.brightnesses.push(0, -0.08);
        participantSeries.columns.template.fillModifier = rgm;

        participantSeries.events.on('validated', () => {
            this.props.dashboardGraphLoaded(TimelineChart.graphType);

            // Update
            this.setState({ updatedAt: new Date() });
        });

        return participantSeries;
    }

    /* *****************************************************************************
     * getUttTooltip                                                          */ /**
     *
     * Get the html tooltip for an utterance.
     *
     * @param fromDate - start of utterance
     * @param toDate - end of utterance
     * @param name - name of participant making utterance
     *
     * @returns tooltip html
     */
    getUttTooltip(fromDate, toDate, name) {
        const nameSpan = `<span style='font-weight:bold;'>${name}</span>`;

        const html = `<div style=''>${nameSpan}: ${formatDuration(getDurationInSeconds(fromDate, toDate))}</div>`;

        return html;
    }

    /* ******************************************************************************
     * generateYAxisCategories                                                 */ /**
     *
     * Generate the y-axis categories for the graph. The y-axis categories will be
     * the names of the participants and the categories for all event types.
     *
     * @param {Object} participantNames - The names of each participant in the meeting.
     * @param {Object} eventTypes - Contains the y-axis categories for each event type.
     *
     * @returns {Object} Containing the y-axis categories for the graph.
     */
    generateYAxisCategories(participantNames, eventTypes) {
        const yAxisCategories = Object.values(participantNames).filter(name => name !== 'You');

        yAxisCategories.push('You');

        // Events y-axis categories
        const eventCategories = eventTypes.map(eventType => EventConfigs[eventType].whatIsCounted);

        yAxisCategories.push(...eventCategories);

        const categoryAxisData = yAxisCategories.map(categoryY => {
            return {
                categoryY
            };
        });

        logger.debug(`${logContext}.generateYAxisCategories:`, { categoryAxisData });

        return categoryAxisData;
    }

    /* ******************************************************************************
     * createYAxis                                                             */ /**
     *
     * Create the y-axis for the graph.
     *
     * For info on amcharts CategoryAxis, view:
     * Https://www.amcharts.com/docs/v4/reference/categoryaxis/
     * https://www.amcharts.com/docs/v4/concepts/axes/category-axis/.
     *
     * @param {Object} chart - The chart object for the TimelinePlot.
     *
     * @returns {Object} Containing the y-axis for the graph.
     */
    createYAxis(chart) {
        const categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());

        categoryAxis.dataFields.category = 'categoryY';
        categoryAxis.fontSize = 10;
        categoryAxis.renderer.inversed = true;
        categoryAxis.cursorTooltipEnabled = false;
        categoryAxis.renderer.minGridDistance = 10;
        categoryAxis.renderer.grid.template.disabled = true;
        categoryAxis.renderer.grid.template.location = 0;

        categoryAxis.renderer.labels.template.adapter.add('textOutput', text =>
            `[font-weight: 600 text-transform: uppercase]${text}`);

        return categoryAxis;
    }

    /* ******************************************************************************
     * createXAxis                                                             */ /**
     *
     * Create the x-axis for the graph.
     *
     * For info on amcharts date-axis, view:
     * Https://www.amcharts.com/docs/v4/concepts/axes/date-axis
     * https://www.amcharts.com/docs/v4/reference/dateaxis/.
     *
     * @param {Object} chart - The chart object for the TimelinePlot.
     *
     * @returns {Object} Containing the x-axis for the graph.
     */
    createXAxis(chart) {
        const dateAxis = chart.xAxes.push(new am4charts.DateAxis());

        // This creates an accuracy of 1 millisecond for utterances and events
        dateAxis.baseInterval = {
            count: 1,
            timeUnit: 'millisecond'
        };
        dateAxis.strictMinMax = true;
        dateAxis.renderer.tooltipLocation = 0;
        dateAxis.cursorTooltipEnabled = true;
        dateAxis.tooltipDateFormat = 'h:mm:ss a';

        // Format the axis labels (setting periodChangeDateFormats is necessary)
        dateAxis.dateFormats.setKey('hour', 'h:mm a');
        dateAxis.dateFormats.setKey('minute', 'h:mm a');
        dateAxis.dateFormats.setKey('second', 'h:mm:ss a');
        dateAxis.dateFormats.setKey('millisecond', 'h:mm:ss SSS a');
        dateAxis.periodChangeDateFormats.setKey('hour', 'h:mm a');
        dateAxis.periodChangeDateFormats.setKey('minute', 'h:mm a');
        dateAxis.periodChangeDateFormats.setKey('second', 'h:mm:ss a');
        dateAxis.periodChangeDateFormats.setKey('millisecond', 'h:mm:ss SSS a');

        return dateAxis;
    }

    /* ******************************************************************************
     * createEventSeries                                                       */ /**
     *
     * Create the graph series for an event type (ex. My Influences)
     * These are technically line charts with bullets (without the line 'strokeWidth = 0').
     *
     * For more info on amcharts LineSeries, see:
     * https://www.amcharts.com/docs/v4/reference/LineSeries/
     *
     * @param {Object} eventType - the eventType that is associated with the events
     *
     * @returns {Object} containing the graph series for an event type
     */
    createEventSeries(eventType) {
        const series = new am4charts.LineSeries();

        series.dataFields.categoryY = 'categoryY';
        series.dataFields.dateX = 'dateTime';
        series.name = EventConfigs[eventType].legendLabel;
        series.eventType = eventType;
        series.strokeWidth = 0;

        // for legend color
        series.fill = EventConfigs[eventType].color;
        series.bullets.push(this.renderCircleBullet());
        series.cursorTooltipEnabled = true;

        // use the color property defined for each event type
        series.bullets.template.propertyFields.fill = 'color';

        return series;
    }

    /* **************************************************************************
     * formatTime                                                          */ /**
     *
     * Format the date and time of an utterance or event.
     *
     * @param {Date | string | number} dt - Anything acceptable to the Date constructor.
     *
     * @returns {string} A formatted representation of the given date/time.
     */
    formatTime(dt) {
        /** Use d3 to create a datetime formatter */
        const d3Format = d3.timeFormat('%I:%M:%S %p');

        return d3Format(new Date(dt));
    }

    /* ******************************************************************************
     * renderCircleBullet                                                      */ /**
     *
     * Create a bullet for an occurrence of an event.
     *
     * @returns {Object} Containing the bullet.
     */
    renderCircleBullet() {
        const bullet = new am4charts.CircleBullet();

        bullet.circle.radius = 5;
        bullet.circle.fillOpacity = 1;
        bullet.horizontalCenter = 'left';
        bullet.verticalCenter = 'bottom';
        bullet.circle.propertyFields.fill = 'color'; // get color from data
        bullet.circle.propertyFields.stroke = 'color'; // get color from data
        bullet.circle.tooltipText = '{tooltip}';

        return bullet;
    }

    /* ******************************************************************************
     * getDatasetStatus                                                        */ /**
     *
     * Check if all of the datasets passed in this.props.graphDatasets are loaded.
     *
     * @param {object} prevProps - Optional, containing the previous props.
     * @param {object} currentProps - Containing the current or next props.
     *
     * @returns {object} containing three booleans:
     *                   1. oneWasLoading  - Was one of the datasets previously loading?
     *                   2. allAreLoaded   - Are all the datasets loaded?
     *                   3. loadingNewData - Is new data being fetched?
     */
    getDatasetStatus({ prevProps, currentProps }) {

        const getStatuses = props => [
            props.datasetStatus,
            ...Object.values(props.eventDatasetStatuses)
        ];

        // This logic doesn't take the NOT_STARTED status into account because it was
        // written when that wasn't a possible status. I think it will still work OK -mjl 2020-09-23
        const currentStatuses = currentProps ? getStatuses(currentProps) : [];
        const prevStatuses = prevProps ? getStatuses(prevProps) : [];
        const oneWasLoading = prevStatuses.some(s => s === RequestStatus.STARTED);
        const allWereLoaded = prevStatuses.every(s => s === RequestStatus.SUCCESS);
        const allAreLoaded = !currentStatuses.some(s => s === RequestStatus.STARTED
                                                        || s === RequestStatus.NOT_STARTED);

        return { oneWasLoading,
            allAreLoaded,
            allWereLoaded };
    }

    /* ******************************************************************************
     * createLegend                                                            */ /**
     *
     * Create the graph legend.
     *
     * For more info on amcharts createLegend, see:
     * Https://www.amcharts.com/docs/v4/concepts/legend/.
     *
     * @param {Object} chart - The chart object for this StackedBarGraph.
     *
     */
    createLegend(chart) {
        chart.legend = new am4charts.Legend();

        // disabling toggling items in legend
        chart.legend.itemContainers.template.clickable = false;
        chart.legend.itemContainers.template.focusable = false;
        chart.legend.itemContainers.template.cursorOverStyle = am4core.MouseCursorStyle.default;

        chart.legend.useDefaultMarker = true;
        chart.legend.labels.template.fill = am4core.color(Colors.tundora);
        chart.legend.labels.template.text = '[font-size: 10px]{name}';

        const markerTemplate = chart.legend.markers.template;

        markerTemplate.width = 10;
        markerTemplate.height = 10;
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
            logger.debug('TimelinePlot: disposed of chart');
        }
    }
}

/* ******************************************************************************
 * getUniqueParticipantNameMap                                             */ /**
 *
 * Map the participant ids to unique names that consist of the participant name
 * with a suffix if needed to make it unique.
 *
 * TODO: If this is used for multiple charts, it should ensure that the same
 *       new (de-duped) name is used consistently for the same participant id.
 *       Check how that is done for participant colors.
 *
 * @param {Array<{id: string, name: string}>} participants
 * @param {string} currentUserId
 *
 * @returns {Object<ParticiantId, string>} Map of participant id to a unique
 *      name for that participant.
 */
function getUniqueParticipantNameMap(participants, currentUserId) {
    // Get participant names, renaming duplicates
    const name2Ids = {};
    const participantNames = {};

    let dups = false;

    for (const p of participants) {
        const name = p.id !== currentUserId ? p.name : 'You';

        participantNames[p.id] = name;

        if (name in name2Ids) {
            dups = true;
            name2Ids[name].push(p.id);
        } else {
            name2Ids[name] = [ p.id ];
        }
    }

    // rename duplicate names by appending a unique suffix
    if (dups) {
        for (const [ name, ids ] of Object.entries(name2Ids)) {
            if (ids.length === 1) {
                // eslint-disable-next-line no-continue
                continue;
            }

            for (let i = 0; i < ids.length; i++) {
                let suffix = `(${i + 1})`;
                let newName = `${name} ${suffix}`;

                // if the newName is already used, keep modifying the suffix
                // until we create a name that isn't used.
                while (newName in name2Ids) {
                    suffix = `${suffix}.1`;
                    newName = `${name} ${suffix}`;
                }

                participantNames[ids[i]] = newName;
                name2Ids[newName] = [ ids[i] ];
            }
        }
    }

    return participantNames;
}

/** The set of dataset types used by the Timeline's overlay event types */
const timelineEventDatasetTypes
    = new Set(TimelineChart.overlayEventTypes.map(eventType => EventConfigs[eventType].datasetType));

const getMetricDatasets = state => state['features/riff-platform'].metrics.entities.riffdata.metricDatasets;
const getDatasetRequests = state => state['features/riff-platform'].metrics.requests.metricDatasets;

/** memoized selector to extract the datasets needed by the timeline's overlay events */
const getTimelineEventDatasets = createSelector(
    getMetricDatasets,
    datasets => {
        const timelineEventDatasets = {};

        for (const datasetType of timelineEventDatasetTypes) {
            timelineEventDatasets[datasetType] = datasets[datasetType];
        }

        return timelineEventDatasets;
    },
);

/** memoized selector to extract the request status for the datasets needed by the timeline's overlay events */
const getTimelineEventDatasetStatuses = createSelector(
    getDatasetRequests,
    datasetRequests => {
        const timelineDatasetStatuses = {};

        for (const datasetType of timelineEventDatasetTypes) {
            timelineDatasetStatuses[datasetType] = datasetRequests[datasetType].status;
        }

        return timelineDatasetStatuses;
    },
);

const mapStateToProps = state => {
    return {
        participantId: state['features/riff-platform'].signIn.user.uid,
        meeting: getSelectedMeeting(state),
        graphDataset: getMetricDataset(state, TimelineChart.datasetType),
        datasetStatus: getDatasetStatus(state, TimelineChart.datasetType),
        eventDatasets: getTimelineEventDatasets(state),
        eventDatasetStatuses: getTimelineEventDatasetStatuses(state),
        participantsStatsData: getMetricDataset(state, SpeakingTime.datasetType)
    };
};

const mapDispatchToProps = dispatch => {
    return {
        dashboardGraphLoaded: graphType => dispatch(metricGraphLoaded(graphType))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TimelineChart);
