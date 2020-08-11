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

import React from 'react';
import PropTypes from 'prop-types';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';

import { ScaleLoader } from 'react-spinners';

import {
    Colors,
    getColorMap,
    logger,
} from '../../../libraries/utils';
import { EStatus, GraphConfigs, GraphTypes } from '../../../libraries/utils/constants';

import { ChartCard } from './ChartCard';
import { AmChartsLegend } from './AmChartsLegend';

/* ******************************************************************************
 * SpeakingTime                                                            */ /**
 *
 * React component to visualize the distribution of speaking time in a meeting.
 *
 ********************************************************************************/
class SpeakingTime extends React.PureComponent {
    static propTypes = {
        /** meeting whose relevant data will be in graphDataset */
        meeting: PropTypes.shape({
            _id: PropTypes.string.isRequired,
            participants: PropTypes.instanceOf(Set).isRequired,
        }),

        /** ID of the logged in user so their data can be distinguished */
        participantId: PropTypes.string.isRequired,

        /** The dataset needed for this pie chart
         *  - the potential datasets are defined in constants/Graphs (GraphDatasets)
         */
        graphDataset: PropTypes.object.isRequired,

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

        this.state = {
            updatedLegendAt: null,
        };

        this.chart = null;
        this.pieSeries = null;

        this.toggleSlice = this.toggleSlice.bind(this);
        this.getLegendItems = this.getLegendItems.bind(this);
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
        // Also, don't re-draw graph if we only want to update the legend
        if (isLoaded && this.state.updatedLegendAt === prevState.updatedLegendAt) {
            this.drawGraph();
        }
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

        const { isLoaded } = this.getDatasetStatus();

        let emptyGraphText = null;
        const graphData = this.props.graphDataset.data;

        if (graphData && graphData.length === 0) {
            emptyGraphText = <div className='empty-graph-text'>{config.empty}</div>;
        }

        let loadingDisplay = null;
        if (!isLoaded) {
            loadingDisplay = (
                <div className='loading-overlay'>
                    {<ScaleLoader color={Colors.lightRoyal} background={Colors.selago}/>}
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
                    className={'amcharts-graph-container speaking-time-graph-div'}
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
     * toggleSlice                                                             */ /**
     *
     * Toggle an event series in the bar graph chart on or off.
     *
     * @param {number} idx the index of the slice that we want to toggle
     */
    toggleSlice(idx) {
        const slice = this.pieSeries.dataItems.getIndex(idx);

        if (slice.visible) {
            slice.hide();
        }
        else {
            slice.show();
        }

        // Have to use set timeout to give AmCharts time to re-calculate
        // graph percentages
        // TODO: Perhaps we can just manually calculuate percentages used in legend. Or if
        // we can turn off the animated percentage wind-down, maybe that would work as well.
        // Currently AmCharts animates the legend percentage from it's value down to 0, so without timeout here,
        // we end up with a random value in the legend, like '2.4%', because AmCharts didn't have time
        // to get to 0.
        setTimeout(() => {
            this.setState({ updatedLegendAt: new Date() });
        }, 1000);
    }

    /* ******************************************************************************
     * getLegendItems                                                          */ /**
     *
     * Return the legend items for this graph.
     *
     */
    getLegendItems() {
        const legendItems = [];

        this.pieSeries.dataItems.each((row, i) => {
            const hidden = row.isHiding || !row.visible;
            const percent = Math.round(row.values.value.percent * 100) / 100;
            const hiddenClass = hidden ? 'hidden' : '';
            // since we dont have access to each participant's ID here,
            // we have to use the private data context from row
            // please forgive me
            const dataColor = row._dataContext.color;

            legendItems.push(
                <div
                    className={`legend-item speaking-time ${hiddenClass}`}
                    onClick={() => this.toggleSlice(i)}
                    key={`speaking-time-legend-item-${i}`}
                >
                    <div className='left'>
                        <span
                            className='peer-color'
                            style={{ background: dataColor }}
                        />
                        <span className='label'>
                            {row.category}
                        </span>
                    </div>
                    <span className='percent'>
                        {percent}{'%'}
                    </span>
                </div>
            );
        });

        return legendItems;
    }

    /* ******************************************************************************
     * getGraphData                                                            */ /**
     *
     * For each participant in a meeting, create config objects for the pie chart
     *
     * @returns {array} containing the prepared data for the graph
     */
    getGraphData() {
        const participantColors = getColorMap(this.props.meeting.participants, this.props.participantId);

        const graphData = this.props.graphDataset.data.map((participant) => {
            const name = participant.participantId === this.props.participantId ? 'You' : participant.name;
            const lengthUtterances = participant.lengthUtterances;

            const config = {
                participant: name,
                lengthUtterances,
                color: participantColors.get(participant.participantId),
            };

            const tooltip = GraphConfigs[this.props.graphType].getTooltip(config);
            config.tooltipText = tooltip;

            return config;
        }).sort((a, b) => b.lengthUtterances - a.lengthUtterances);

        logger.debug('SpeakingTime: graphData', { graphData });
        return graphData;
    }

    /* ******************************************************************************
     * drawGraph                                                               */ /**
     *
     * Initialise the graph, add the categories, and populate with data.
     * - if an empty dataset is passed, return
     *
     */
    drawGraph() {
        logger.debug('SpeakingTime: drawGraph', this.props.graphType);
        const chart = this.chart;

        const chartData = this.getGraphData();
        chart.data = chartData;

        // Is this component trying to visualise an empty dataset?
        const emptyDataset = chartData.length === 0;
        if (emptyDataset) {
            chart.hide();
            this.props.dashboardGraphLoaded(this.props.graphType);
            return;
        }

        chart.show();
    }

    /* ******************************************************************************
     * createSeries                                                            */ /**
     *
     * Create the graph series
     *
     * For more info on amcharts PieSeries, see:
     * https://www.amcharts.com/docs/v4/reference/pieseries/
     *
     * @param {object} chart - the chart object for this SpeakingTime
     *
     * @returns {object} containing the graph series for this graph type
     */
    createSeries(chart) {
        const series = chart.series.push(new am4charts.PieSeries());

        series.dataFields.value = 'lengthUtterances';
        series.dataFields.category = 'participant';
        series.labels.template.disabled = true;
        series.padding = 0;

        const slices = series.slices.template;
        slices.propertyFields.fill = 'color';
        slices.cornerRadius = 1;
        slices.tooltipText = '{tooltipText}';
        slices.stroke = am4core.color('#fff');
        slices.strokeWidth = 1;
        slices.strokeOpacity = 1;
        slices.states.getKey('active').properties.shiftRadius = 0; // remove this default animation

        series.legendSettings.labelText = '{name}';
        series.legendSettings.valueText = '[bold]{value.percent}[/]%';
        series.legendSettings.paddingLeft = 0;

        return series;
    }

    /* ******************************************************************************
     * initGraph                                                               */ /**
     *
     * Initialise the chart and bind to the appropriate html element.
     *
     * For more info on amcharts PieChart, see:
     * https://www.amcharts.com/docs/v4/reference/PieChart/
     * https://www.amcharts.com/docs/v4/chart-types/pie-chart/
     *
     * @returns {object} containing a reference to the chart
     */
    initGraph() {
        logger.debug('SpeakingTime.initGraph', this.props.graphType);

        // Hide am-charts logo (paid version)
        am4core.options.commercialLicense = true;

        // Create chart and place it inside the html element with id speaking-time-graph-div
        const chart = am4core.create('speaking-time-graph-div', am4charts.PieChart);
        chart.background.fill = Colors.selago;
        chart.numberFormatter.numberFormat = '##.#';
        chart.radius = '75%';

        // Fired when graph's data gets updated
        chart.events.on('datavalidated', () => {
            this.props.dashboardGraphLoaded(this.props.graphType);
            // Update legend
            this.setState({ updatedLegendAt: new Date() });
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
            logger.debug(`SpeakingTime: disposed of chart - ${this.props.graphType}`);
        }
    }

    /* ******************************************************************************
     * getDatasetStatus                                                        */ /**
     *
     * Check if the dataset passed in this.props.graphDataset is loaded.
     *
     * @param {object} prevProps optional, containing the previous props
     *
     * @returns {object} containing three booleans:
     *      1. wasLoading  - Was the dataset previously loading?
     *      2. isLoaded   - Is the dataset loaded?
     *      3. loadingNewData - Is new data being fetched?
     */
    getDatasetStatus(prevProps) {
        const currentStatus = this.props.graphDataset.status;
        const isLoaded = currentStatus === EStatus.LOADED;

        let wasLoaded = true;
        let wasLoading = false;

        if (prevProps) {
            wasLoading = prevProps.graphDataset.status === EStatus.LOADING;
            wasLoaded = prevProps.graphDataset.status === EStatus.LOADED;
        }

        const loadingNewData = wasLoaded && !isLoaded;

        return { wasLoading, isLoaded, loadingNewData };
    }
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    SpeakingTime,
};


