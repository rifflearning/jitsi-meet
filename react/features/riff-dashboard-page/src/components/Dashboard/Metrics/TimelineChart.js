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

import React from 'react';
import PropTypes from 'prop-types';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';

import { ScaleLoader } from 'react-spinners';

import { d3 } from 'libs/d3';
import { 
    logger, 
    formatDuration, 
    getDurationInSeconds 
} from 'libs/utils';
import {
    Colors,
    getColorMap,
} from './colorsHelpers';

import {
    EStatus,
    GraphConfigs,
    GraphDatasetTypes,
    GraphTypes,
} from 'libs/utils/constants';

import { ChartCard } from './ChartCard';

import { AmChartsLegend } from './AmChartsLegend';

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

        /** meeting whose relevant data will be in graphDataset */
        meeting: PropTypes.shape({
            _id: PropTypes.string.isRequired,
            participants: PropTypes.instanceOf(Set).isRequired,
        }),

        /** ID of the logged in user so their data can be distinguished */
        participantId: PropTypes.string.isRequired,

        /** All of the graph datasets defined in constants/Graphs (GraphDatasets)
         *  - the keys of this object are defined in constants/Graphs (GraphDatasets)
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

        /** The event types to be displayed in this graph */
        eventTypes: PropTypes.arrayOf(PropTypes.oneOf(Object.values(GraphTypes))).isRequired,

        /** A unique graph type used to fetch configurations for this graph */
        graphType: PropTypes.oneOf(Object.values(GraphTypes)).isRequired,

        /** sets a graphical rendering status for a graph type to loaded */
        dashboardGraphLoaded: PropTypes.func.isRequired,
    };

    /* **************************************************************************
     * constructor                                                         */ /**
     */
    constructor(props) {
        super(props);

        this.state = {
            updatedLegendAt: null,
        };

        this.chart = null;
        this.eventsDatasets = {};
        this.categoryAxis = {};
        this.dateAxis = {};
        this.participantSeries = {};
        this.eventsSeries = [];
        this.legend = {};

        this.toggleSeries = this.toggleSeries.bind(this);
        this.getLegendItems = this.getLegendItems.bind(this);
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
        logger.debug('TimelinePlot.willUnmount: disposed of chart');
    }

    /* **************************************************************************
     * componentDidUpdate                                                  */ /**
     *
     */
    componentDidUpdate(prevProps, prevState) {
        const { allAreLoaded } = this.getDatasetStatus({
            prevProps,
            currentProps: this.props,
        });

        // If one of the dataset's previous status was 'loading',
        // and all of the dataset's current status is 'loaded', then draw graph
        // Also, don't re-draw graph if we only want to update the legend
        if (allAreLoaded && this.state.updatedLegendAt === prevState.updatedLegendAt) {
            logger.debug('TimelinePlot.didUpdate: drawing graph', this.props);
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
        logger.debug('TimelinePlot: render');

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
                <div
                    className='amcharts-graph-container timeline-plot-div'
                />
                {this.state.updatedLegendAt !== null &&
                    <AmChartsLegend
                        graphType={this.props.graphType}
                        getLegendItems={this.getLegendItems}
                        updatedLegendAt={this.state.updatedLegendAt}
                    />
                }
            </ChartCard>
        );
    }

    /* ******************************************************************************
     * toggleSeries                                                            */ /**
     *
     * Toggle an event series in the timeline chart on or off.
     *
     * @param {object} series the event series object that we want to toggle
     */
    toggleSeries(series) {
        // If the series has no data, don't do anything on toggle
        if (series.noData) {
            return;
        }

        if (series.isHidden || series.isHiding) {
            series.show(); // show this data in chart
        }
        else {
            series.hide(); // hide this data in chart
        }

        // Update legend
        this.setState({ updatedLegendAt: new Date() });
    }

    /* ******************************************************************************
     * getLegendItems                                                          */ /**
     *
     * Return the legend items for this graph.
     *
     */
    getLegendItems() {
        const legendItems = [];
        this.eventsSeries.forEach((series) => {
            const graphConfig = GraphConfigs[series.graphType];

            // Apply hidden styles to the legend item if it's been toggled,
            // or if it's empty series
            const hidden = series.isHidden || series.isHiding || series.noData;
            const hiddenClass = hidden ? 'hidden' : '';

            // Apply extra styles if series has no data
            const emptyDatasetClass = series.noData ? 'empty-dataset' : '';

            // Legend item color - If no data in series, grey, else color from config
            const legendItemColor = series.noData ? '#999999' : graphConfig.color;


            legendItems.push(
                <div
                    className={`legend-item timeline ${hiddenClass} ${emptyDatasetClass}`}
                    onClick={() => this.toggleSeries(series)}
                    key={`timeline-legend-item-${series.graphType}`}
                >
                    <span
                        className='peer-color'
                        style={{ background: legendItemColor }}
                    />
                    <span className='label'>
                        {GraphConfigs[series.graphType].legendLabel}
                    </span>
                </div>
            );
        });

        return legendItems;
    }

    /* ******************************************************************************
     * initGraph                                                               */ /**
     *
     * Initialise the chart and bind to the appropriate html element.
     *
     * For more info on amcharts XYChart, see:
     * https://www.amcharts.com/docs/v4/reference/XYChart/
     * https://www.amcharts.com/docs/v4/chart-types/xy-chart/
     *
     * @returns {object} containing a reference to the chart
     */
    initGraph() {
        // Hide am-charts logo (paid version)
        am4core.options.commercialLicense = true;

        // Create chart and place it inside the html element with id timeline-plot-div
        const chart = am4core.create('timeline-plot-div', am4charts.XYChart);

        chart.background.fill = Colors.white;

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

        logger.debug('TimelinePlot: drawGraph');
        const chart = this.chart;

        const timelineData = this.props.graphDatasets[GraphDatasetTypes.UTTERANCE_TIMELINE].data;
        logger.debug('TimelinePlot: timelineData', { timelineData });

        // Is this component trying to visualise an empty dataset?
        const emptyDataset = timelineData.utts.length === 0;
        if (emptyDataset) {
            chart.hide();
            this.props.dashboardGraphLoaded(this.props.graphType);
            return;
        }
        chart.show();

        const participants = timelineData.sortedParticipants;
        logger.debug('TimelinePlot: participants', { participants });

        // Get participant names, renaming duplicates
        const participantNames = getUniqueParticipantNameMap(participants);

        // Set x-axis min and max
        this.dateAxis.min = new Date(timelineData.startTime).getTime();
        this.dateAxis.max = new Date(timelineData.endTime).getTime();

        // Generate y-axis categories
        this.categoryAxis.data = this.generateYAxisCategories(participantNames, this.props.eventTypes);

        // Add data to the participant column series, which represents the speaking timeline
        // for each participant
        this.addParticipantData(participantNames, timelineData);

        // Add data to each events series
        this.addEventsData();

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
     * Map over the event types and add the data to the respective graph series
     *
     * @returns {object} containing the event data for each GraphType
     */
    addEventsData() {
        this.eventsSeries.map((eventSeries) => {
            const graphType = eventSeries.graphType;

            const data = GraphConfigs[graphType].eventsFilter(
                this.props.graphDatasets[GraphConfigs[graphType].datasetType].data.events,
                this.props.participantId,
            );

            eventSeries.noData = data.length === 0;

            const graphConfig = GraphConfigs[graphType];

            eventSeries.data = data.map((event) => {
                return {
                    name: graphConfig.legendLabel,
                    graphType,
                    categoryY: graphConfig.whatIsCounted,
                    dateTime: new Date(graphConfig.getEventTime(event)),
                    color: graphConfig.color,
                    tooltip: graphConfig.getTimelineTooltip({
                        source: graphConfig.getSourceParticipant(event),
                        target: graphConfig.getTargetParticipant(event),
                        eventTime: this.formatTime(graphConfig.getEventTime(event)),
                    }),
                };
            });
        });

        logger.debug(`TimelinePlot.addEventsData: ${this.props.graphType}`, { eventsSeries: this.eventsSeries });
    }

    /* ******************************************************************************
     * createAllEventSeries                                                    */ /**
     *
     * Map over the event types and create an amcharts graph series for each
     *
     * @param {object} chart the chart object for the TimelinePlot
     *
     * @returns {array} containing the graph series for each GraphType
     */
    createAllEventSeries(chart) {
        const eventsSeries = [];

        this.props.eventTypes.map((graphType) => {
            const config = {
                graphType,
            };

            const graphSeries = this.createEventSeries(graphType);
            config.series = graphSeries;

            eventsSeries.push(graphSeries);
            chart.series.push(graphSeries);

            logger.debug(`TimelinePlot: ${graphType}`, { config, graphSeries });
        });

        logger.debug(`TimelinePlot: createAllEventSeries`, { eventsSeries });
        return eventsSeries;
    }

    /* ******************************************************************************
     * addParticipantData                                                      */ /**
     *
     * Map over all utterances and populate participant speaking time columns
     *
     * For more info on amcharts ColumnSeries, see:
     * https://www.amcharts.com/docs/v4/reference/columnseries/
     *
     * @param {object} participantNames the names of each participant in the meeting
     * @param {object} timelineData the timeline data for a meeting
     */
    addParticipantData(participantNames, timelineData) {
        const participantsData = this.props.graphDatasets?.meeting_stats?.data || [];
        //sorted participants ids are required for generating correct colors   
        const sortedParticipantsIds = participantsData
            .sort((a, b) => b.lengthUtterances - a.lengthUtterances)
            .map(participant => participant.participantId);

        const participantColors = getColorMap(sortedParticipantsIds, this.props.participantId);

        const participantSeriesData = [];
        timelineData.utts.map((utt) => {

            const { color, level } = participantColors.get(utt.participant) || {};

            const name = participantNames[utt.participant];
            const fromDate = new Date(utt.startDate);
            const toDate = new Date(utt.endDate);
            const chartUtt = {
                name,
                categoryY: participantNames[utt.participant],
                fromDate,
                toDate,
                color: am4core.color(color).brighten(level),
                tooltipHTML: this.getUttTooltip(fromDate, toDate, name),
            };

            participantSeriesData.push(chartUtt);
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
     * https://www.amcharts.com/docs/v4/reference/columnseries/
     *
     * @param {object} chart the chart object for the TimelinePlot
     *
     * @returns {object} containing the graph series config for each GraphType
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
            this.props.dashboardGraphLoaded(this.props.graphType);
            // Update legend
            this.setState({ updatedLegendAt: new Date() });
        });
        return participantSeries;
    }

    /* *****************************************************************************
     * getUttTooltip                                                          */ /**
     *
     * Get the html tooltip for an utterance
     *
     * @param {string} name
     * @param {Array<{label: string, value: number}> counts
     *
     * @returns {string} tooltip html
     * interaction counts.
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
     * the names of the participants and the categories for all event types
     *
     * @param {object} participantNames the names of each participant in the meeting
     * @param {object} eventTypes contains the y-axis categories for each event type
     *
     * @returns {object} containing the y-axis categories for the graph
     */
    generateYAxisCategories(participantNames, eventTypes) {
        const yAxisCategories = [];

        // Participant speaking time lines
        Object.keys(participantNames).map((partId) => {
            const partName = participantNames[partId];
            // Make sure the 'You' speaking time is last, so it lines up with events
            if (partName !== 'You') {
                yAxisCategories.push(partName);
            }
        });

        yAxisCategories.push('You');

        // Events y-axis categories
        eventTypes.map((graphType) => {
            const yAxisCategory = GraphConfigs[graphType].whatIsCounted;
            yAxisCategories.push(yAxisCategory);
        });

        const categoryAxisData = yAxisCategories.map((categoryY) => {
            return {
                categoryY,
            };
        });

        logger.debug('TimelinePlot: generateYAxisCategories', { categoryAxisData });
        return categoryAxisData;
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
     * @param {object} chart the chart object for the TimelinePlot
     *
     * @returns {object} containing the y-axis for the graph
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
        categoryAxis.labelColorField = 'color';

        categoryAxis.renderer.labels.template.adapter.add("textOutput", function (text) {
            return `[font-weight: 600 text-transform: uppercase]${text}`
        });

        return categoryAxis;
    }

    /* ******************************************************************************
     * createXAxis                                                             */ /**
     *
     * Create the x-axis for the graph
     *
     * For info on amcharts date-axis, view:
     * https://www.amcharts.com/docs/v4/concepts/axes/date-axis
     * https://www.amcharts.com/docs/v4/reference/dateaxis/
     *
     * @param {object} chart the chart object for the TimelinePlot
     *
     * @returns {object} containing the x-axis for the graph
     */
    createXAxis(chart) {
        const dateAxis = chart.xAxes.push(new am4charts.DateAxis());

        // This creates an accuracy of 1 millisecond for utterances and events
        dateAxis.baseInterval = { count: 1, timeUnit: 'millisecond' };
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
     * These are technically line charts with bullets (without the line 'strokeWidth = 0')
     *
     * For more info on amcharts LineSeries, see:
     * https://www.amcharts.com/docs/v4/reference/LineSeries/
     *
     * @param {object} graphType the graphType that is associated with the events
     *
     * @returns {object} containing the graph series for an event type
     */
    createEventSeries(graphType) {
        const series = new am4charts.LineSeries();
        series.dataFields.categoryY = 'categoryY';
        series.dataFields.dateX = 'dateTime';
        series.name = 'name';
        series.graphType = graphType;
        series.strokeWidth = 0;
        series.bullets.push(this.renderCircleBullet());
        series.cursorTooltipEnabled = true;

        // use the color property defined for each event type
        series.bullets.template.propertyFields.fill = 'color';

        return series;
    }

    /* **************************************************************************
     * formatTime                                                          */ /**
     *
     * Format the date and time of an utterance or event
     *
     * @param {Date | string | number} dt - anything acceptable to the Date constructor
     *
     * @returns {string} a formatted representation of the given date/time
     */
    formatTime(dt) {
        /** Use d3 to create a datetime formatter */
        const d3Format = d3.timeFormat('%I:%M:%S %p');

        return d3Format(new Date(dt));
    }

    /* ******************************************************************************
     * renderCircleBullet                                                      */ /**
     *
     * Create a bullet for an occurrence of an event
     *
     * @returns {object} containing the bullet
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
     * @param {object} prevProps optional, containing the previous props
     * @param {object} currentProps containing the current or next props
     *
     * @returns {object} containing three booleans:
     *                   1. oneWasLoading  - Was one of the datasets previously loading?
     *                   2. allAreLoaded   - Are all the datasets loaded?
     *                   3. loadingNewData - Is new data being fetched?
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
            logger.debug(`TimelinePlot: disposed of chart`);
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
 *
 * @returns {Object<ParticiantId, string>} map of participant id to a unique
 *      name for that participant
 */
function getUniqueParticipantNameMap(participants) {
    // Get participant names, renaming duplicates
    const name2Ids = {};
    const participantNames = {};

    let dups = false;
    for (const p of participants) {
        participantNames[p.id] = p.name;

        if (p.name in name2Ids) {
            dups = true;
            name2Ids[p.name].push(p.id);
        }
        else {
            name2Ids[p.name] = [ p.id ];
        }
    }

    // rename duplicate names by appending a unique suffix
    if (dups) {
        for (const [ name, ids ] of Object.entries(name2Ids)) {
            if (ids.length === 1) {
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
            }
        }
    }

    return participantNames;
}


/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    TimelineChart,
};
