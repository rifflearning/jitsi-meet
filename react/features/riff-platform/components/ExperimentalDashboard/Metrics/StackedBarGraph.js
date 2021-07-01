/* eslint-disable jsdoc/require-description-complete-sentence */
/* eslint-disable valid-jsdoc */
/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* ******************************************************************************
 * StackedBarGraph.js                                                           *
 * *************************************************************************/ /**
 *
 * @fileoverview React component to visualize binary relations calculated with
 * the computePairwiseRelation() function in libs/utils/index.js
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
import { GraphTypes } from '@rifflearning/riff-metrics';
import * as d3 from 'd3-array';
import PropTypes from 'prop-types';
import React from 'react';
import { ScaleLoader } from 'react-spinners';

import ChartCard from '../ChartCard/ChartCard';
import { Colors } from '../colorHelper';
import { EventConfigs, GraphConfigs } from '../config';
import { getParticipantName } from '../functions';
import { RequestStatus, logger } from '../utils';

/** define the logContext (since the only thing in this module is the StackedBarGraph class
 *  we can specify that w/o a qualifier on the const name
 */
const logContext = 'StackedBarGraph';

/* ******************************************************************************
 * StackedBarGraph                                                         */ /**
 *
 ********************************************************************************/
class StackedBarGraph extends React.PureComponent {
    static propTypes = {
        /** Sets a graphical rendering status for a graph type to loaded */
        dashboardGraphLoaded: PropTypes.func.isRequired,

        /** The request status of the graphDataset */
        datasetStatus: PropTypes.string,

        /** The main dataset that is used for this graph */
        graphDataset: PropTypes.object.isRequired,

        /** The graph types we're embedding in this stacked bar graph */
        graphType: PropTypes.oneOf(Object.values(GraphTypes)).isRequired,

        /** Meeting whose relevant data will be in graphDataset */
        meeting: PropTypes.shape({
            _id: PropTypes.string.isRequired,
            participants: PropTypes.instanceOf(Map).isRequired
        }),

        /** ID of the logged in user so their data can be distinguished */
        participantId: PropTypes.string.isRequired,

        /** The event types we're stacking in this stacked bar graph */
        stackedEventTypes: PropTypes.array
    };

    /* **************************************************************************
     * constructor                                                         */ /**
     */
    constructor(props) {
        super(props);

        this.state = {
            updatedAt: null
        };

        this.chart = null;
        this.series = [];
        this.avrAxisRange = 0;
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
        this.chart = null;
        logger.debug(`${logContext}.willUnmount: disposed of chart`);
    }

    /* **************************************************************************
     * componentDidUpdate                                                  */ /**
     */
    componentDidUpdate(prevProps, prevState) {
        const { isLoaded } = this.getDatasetStatus(prevProps);

        // If the dataset's current status is 'loaded', then draw graph
        if (isLoaded && this.state.updatedAt === prevState.updatedAt) {
            logger.debug(`${logContext}.didUpdate: drawing graph`, { props: this.props });
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
        // get the config for this graph type
        const config = GraphConfigs[this.props.graphType];
        const meetingId = this.props.meeting ? this.props.meeting._id : 'no-selected-meeting';
        const chartCardId = `cc-${meetingId}-${config.title.replace(' ', '-')}`;

        const { isLoaded } = this.getDatasetStatus();

        // 3 possible displayed contents for the chart card:
        //  1) loading indicator 2) empty text 3) graph and graph legend
        const chartCardChildren = [];

        // Because we have amcharts initialize the graph when the component is mounted, the
        // div it will render in must always exist until the component is dismounted, so we
        // always add it as a chart card child.
        chartCardChildren.push(
            <div
                className = { `amcharts-graph-container ${this.props.graphType}-grouped-bar-graph-div` }
                key = 'amchart-div' />,
        );

        // eslint-disable-next-line no-negated-condition
        if (!isLoaded) {
            // loading indicator
            chartCardChildren.push(
                <div
                    className = 'loading-overlay'
                    key = 'loading'>
                    {<ScaleLoader color = { Colors.lightRoyal } />}
                </div>,
            );
        } else {
            // TODO: Determine empty dataset better.
            // getGraphData is called in drawGraph as well, but we don't want to set
            // state there because it will cause a re-render.
            const graphData = this.getGraphData();

            if (graphData.length === 0) {
                // empty text
                chartCardChildren.push(
                    <div
                        className = 'empty-graph-text'
                        key = 'empty-text'>{config.empty}</div>,
                );
            }
        }

        return (
            <ChartCard
                chartCardId = { chartCardId }
                chartInfo = { config.info }
                longDescription = { config.info.length > 250 }
                title = { config.title }>
                {chartCardChildren}
            </ChartCard>
        );
    }

    /* ******************************************************************************
     * getGraphData                                                            */ /**
     *
     * For each embedded graph type passed in props, parse through the data and
     * organise it under participant names.
     *
     * @returns {Array<{
     *              participant: string,                - participant name
     *              totalRelations: number,
     *              [eventType.legendLabel...]: number, - One of these for each of
     *                                                    the event types
     *                                                    e.g. 'Your Affirmations' and
     *                                                    'Their Affirmations'
     *          }>} containing the prepared data for the graph.
     */
    getGraphData() {
        if (this.props.graphDataset.relationCounts.size === 0) {
            return [];
        }

        logger.debug(`${logContext}.getGraphData: graphDataset`, this.props.graphDataset);

        const chartData = new Map();
        const counts = this.props.graphDataset.relationCounts;

        for (const eventType of this.props.stackedEventTypes) {
            const eventConfig = EventConfigs[eventType];
            const eventCounts = eventConfig.getEventCounts(counts, this.props.participantId);
            const eventLabel = eventConfig.legendLabel;

            for (const eventCount of eventCounts) {
                const pid = eventCount.participantId;

                if (!chartData.has(pid)) {
                    const participant = getParticipantName(this.props.meeting, pid);
                    const participantName = participant.split(' ')[0];

                    chartData.set(pid, {
                        name: participantName,
                        participant,
                        totalRelations: 0
                    });
                }
                const participantData = chartData.get(pid);

                participantData[eventLabel] = eventCount.count;
                participantData.totalRelations += eventCount.count;
            }
        }

        return Array.from(chartData.values());
    }

    /* ******************************************************************************
     * drawGraph                                                               */ /**
     *
     * Initialise the graph, add the axes, and populate with data.
     * - if an empty dataset is passed, return.
     *
     */
    drawGraph() {
        // Force each series in the chart to refresh its data
        this.series.forEach(series => series.invalidateData());

        logger.debug(`${logContext}.drawGraph`);
        const chart = this.chart;

        const chartData = this.getGraphData();

        // Is this component trying to visualise an empty dataset?
        const emptyDataset = chartData.length === 0;

        if (emptyDataset) {
            chart.hide();
            this.props.dashboardGraphLoaded(this.props.graphType);

            return;
        }
        chart.show();

        // See of any series in this graph (ie. no 'THEIR_INFLUENCE') is empty.
        // => For each series, map through all participants and check if every participant
        //    doesn't have this relation type
        this.series.forEach(series => {
            const emptySeries = chartData.every(participant =>
                !participant[EventConfigs[series.eventType].legendLabel]);

            if (emptySeries) {
                series.noData = true;
                series.hide();
            } else {
                series.show();
            }
        });

        // show average
        const yAxisAverage = this.getYAxisAverage(chartData);

        this.avrAxisRange.value = yAxisAverage;

        chart.data = chartData;
    }

    /* ******************************************************************************
     * createSeries                                                            */ /**
     *
     * Create the graph series for an embedded graph type ex. MY_INFLUENCE.
     *
     * For more info on amcharts ColumnSeries, see:
     * Https://www.amcharts.com/docs/v4/reference/columnseries/.
     *
     * @param {Object} chart - The chart object for this StackedBarGraph.
     * @param {Object} graphType - The graph type for this series.
     *
     */
    createSeries(chart, eventType) {
        const config = EventConfigs[eventType];
        const series = chart.series.push(new am4charts.ColumnSeries());

        series.eventType = eventType;
        series.dataFields.valueY = config.legendLabel;
        series.dataFields.categoryX = 'name';
        series.name = config.legendLabel;
        series.columns.template.fill = am4core.color(config.color);
        series.columns.template.stroke = am4core.color(config.color);
        series.columns.template.tooltipText = config.getCountTooltip();
        series.stacked = true;
        series.columns.template.width = am4core.percent(95);
        series.columns.template.maxWidth = 150;

        const rgm = new am4core.LinearGradientModifier();

        rgm.brightnesses.push(0, -0.07, -0.18);
        series.columns.template.fillModifier = rgm;

        this.series.push(series);
    }

    /* ******************************************************************************
     * createYAxis                                                             */ /**
     *
     * Create the y-axis for the graph.
     *
     * @param {Object} chart - The chart object for this StackedBarGraph.
     *
     * @returns {Object} Containing the y-axis for the graph.
     */
    createYAxis(chart) {
        const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

        valueAxis.min = 0;
        valueAxis.maxPrecision = 0; // Makes the axis steps integers
        valueAxis.title.disabled = true;

        valueAxis.renderer.grid.template.disabled = true;
        valueAxis.renderer.labels.template.disabled = true;

        const range = valueAxis.axisRanges.create();

        range.grid.stroke = am4core.color(Colors.mineShaft);
        range.grid.strokeDasharray = '4, 4';
        range.grid.strokeWidth = 2;
        range.label.fill = am4core.color(Colors.tundora);
        range.label.text = '[text-transform: uppercase]average';
        range.label.verticalCenter = 'middle';

        this.avrAxisRange = range;

        return valueAxis;
    }

    /* ******************************************************************************
     * createXAxis                                                             */ /**
     *
     * Create the x-axis for the graph.
     *
     * For info on amcharts CategoryAxis, view:
     * Https://www.amcharts.com/docs/v4/reference/categoryaxis/
     * https://www.amcharts.com/docs/v4/concepts/axes/category-axis/.
     *
     * @param {Object} chart - The chart object for this StackedBarGraph.
     *
     * @returns {Object} Containing the x-axis for the graph.
     */
    createXAxis(chart) {
        // TODO - the axis doesn't properly resize the cell width when
        // switching between meetings, which results in improperly truncated
        // names, etc. need to address this but not sure how
        // - jr 05.08.20
        const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());

        categoryAxis.dataFields.category = 'name';
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.grid.template.disabled = true;
        categoryAxis.renderer.minGridDistance = 20;
        categoryAxis.renderer.cellStartLocation = 0.1;
        categoryAxis.renderer.cellEndLocation = 0.9;
        categoryAxis.renderer.line.strokeOpacity = 1;
        categoryAxis.renderer.line.strokeWidth = 2;
        categoryAxis.renderer.line.stroke = am4core.color(Colors.scorpion);

        const label = categoryAxis.renderer.labels.template;

        label.fontSize = 10;
        label.truncate = true;
        label.fill = am4core.color(Colors.mineShaft);
        label.tooltipText = '{participant}';

        label.adapter.add('textOutput', text => `[font-weight: 600 text-transform: uppercase]${text}`);

        const defineMaxWidth = axis => {
            const cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex);

            return cellWidth;
        };

        categoryAxis.events.on('sizechanged', ev => {
            const axis = ev.target;

            axis.renderer.labels.template.maxWidth = defineMaxWidth(axis);
        });

        // fix label truncate
        label.adapter.add('maxWidth', (width, target) => {
            const axis = target.axis;

            if (axis) {
                return defineMaxWidth(axis);
            }

            return width;
        });


        return categoryAxis;
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
        logger.debug('StackedBarGraph.initGraph', this.props.graphType);

        // Hide am-charts logo (paid version)
        am4core.options.commercialLicense = true;

        // Create chart and place it inside the html element with id {graphType}-grouped-bar-graph-div
        const chart = am4core.create(`${this.props.graphType}-grouped-bar-graph-div`, am4charts.XYChart);

        chart.background.fill = Colors.white;

        // Fired when graph's data gets updated
        chart.events.on('datavalidated', () => {
            this.props.dashboardGraphLoaded(this.props.graphType);

            this.setState({ updatedAt: new Date() });
        });

        // Create categoryAxis axis
        // Disable lint because this variable might be useful in future
        // eslint-disable-next-line no-unused-vars
        const categoryAxis = this.createXAxis(chart);

        // Create valueAxis axis
        // Disable lint because this variable might be useful in future
        // eslint-disable-next-line no-unused-vars
        const valueAxis = this.createYAxis(chart);

        // Create a graph series for each embedded graph type
        // eslint-disable-next-line arrow-parens
        this.props.stackedEventTypes.forEach((eventType) => {
            this.createSeries(chart, eventType);
        });

        this.createLegend(chart);
        this.chart = chart;

        return chart;
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

        chart.legend.parent = chart.tooltipContainer;
        chart.legend.contentAlign = 'left';
        chart.legend.position = 'absolute';
        chart.legend.valign = 'bottom';
        chart.legend.labels.template.fill = am4core.color(Colors.tundora);
        chart.legend.labels.template.text = '[font-size: 10px]{name}';
        chart.legend.width = 130;

        // legend positioning
        chart.legend.dx = -10;
        chart.legend.dy = -35;

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
        }
    }

    /* ******************************************************************************
     * getDatasetStatus                                                        */ /**
     *
     * Check if the dataset passed in this.props.graphDataset is loaded.
     *
     * @param {object} prevProps - Optional, containing the previous props.
     *
     * @returns {object} containing three booleans:
     *      1. wasLoading     - Was the dataset previously loading?
     *      2. isLoaded       - Is the dataset loaded?
     *      3. loadingNewData - Is new data being fetched?
     */
    getDatasetStatus(prevProps) {
        const wasLoading = prevProps
            && (prevProps.datasetStatus === RequestStatus.STARTED
            || prevProps.datasetStatus === RequestStatus.NOT_STARTED);
        const isLoaded = this.props.datasetStatus === RequestStatus.SUCCESS;
        const wasLoaded = prevProps && prevProps.datasetStatus !== RequestStatus.SUCCESS;

        const loadingNewData = wasLoaded && !isLoaded;

        return {
            wasLoading,
            isLoaded,
            loadingNewData
        };
    }

    /* ******************************************************************************
     * getYAxisAverage                                                        */ /**
     *
     * Create the average y-axis for the graph.
     *
     * @param {Object} chartData - The chart data for this StackedBarGraph.
     *
     * @returns {number} Average y-axis value for the graph.
     */
    getYAxisAverage(chartData) {
        const sum = d3.sum(chartData, d => d.totalRelations || 0);
        const count = chartData.length + 1;
        const avr = sum / count;

        return avr;
    }
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    StackedBarGraph
};
