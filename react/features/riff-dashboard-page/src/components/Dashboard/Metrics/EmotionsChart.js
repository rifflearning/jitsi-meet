/* ******************************************************************************
 * EmotionsChart.js                                                             *
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
    Colors,
    formatDuration,
    getColorMap,
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
import EmotionsGraph from './EmotionsGraph';

import api from '../../../../../riff-platform/api';
/* ******************************************************************************
 * EmotionsChart                                                           */ /**
 *
 * React component to visualize the speaking timeline for each participant in a
 * meeting. It also shows when critical events in the meeting involving you and
 * other participants took place.
 *
 ********************************************************************************/
class EmotionsChart extends React.Component {
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
            emotionsData: [],
            emotionsDataLoading: false
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
        setTimeout(()=>this.getEmotionsData(), 0); // no meetingId if call synchronously
    }

    /* **************************************************************************
     * componentDidUpdate                                                  */ /**
     *
     */
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.meeting?._id !== this.props.meeting?._id) {
            this.getEmotionsData();
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
        if (this.state.emotionsData.length === 0) {
            emptyGraphText = <div className='empty-graph-text'>It doesn't look like emotions detection module was enabled.</div>;
        }

        let loadingDisplay = null;
        if (!allAreLoaded || this.state.emotionsDataLoading) {
            loadingDisplay = (
                <div className='loading-overlay'>
                    {<ScaleLoader color={Colors.lightRoyal}/>}
                </div>
            );
        }

        return (
            <ChartCard
                title={'Emotions Chart (experimental feature)'}
                chartInfo={'This chart shows how your emotions and the average emotional state of all the participants are changed during the meeting.'}
                chartCardId={'EmotionsChartId'}
            >
                {loadingDisplay}
                {emptyGraphText}
                    <EmotionsGraph
                        data={this.state.emotionsData}
                        participantId={this.props.participantId}
                        startTime={timelineData?.startTime}
                        endTime={timelineData?.endTime}
                        dashboardGraphLoaded={this.props.dashboardGraphLoaded} />
            </ChartCard>
        );
    }

    getEmotionsData() {
        if (!this.props.meeting?._id) return console.error('no meeting id for getEmotionsData');
        this.setState({ emotionsDataLoading: true });
        api.fetchEmotions(this.props.meeting._id)
            .then((data) => this.setState({ emotionsDataLoading: false, emotionsData: data }))
            .catch(() => this.setState({ emotionsDataLoading: false, emotionsData: [] }))
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
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    EmotionsChart
};
