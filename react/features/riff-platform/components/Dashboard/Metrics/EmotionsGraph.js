/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-param-reassign */
/* eslint-disable require-jsdoc */
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import * as d3 from 'd3-array';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useRef, useEffect, useState } from 'react';

import { Colors } from '../colorHelper';

const formatTime = dt => new Date(dt).getTime();

const getBollingerBands = (n, k, data) => {
    if (n >= data.length) {
        return [];
    }
    const bands = []; // { ma: 0, area:[0, 0] }

    for (let i = n - 1, len = data.length; i < len; i++) {
        const slice = data.slice(i + 1 - n, i);
        const mean = d3.mean(slice, d => d.classification);

        const stdDev = Math.sqrt(
      d3.mean(
        slice.map(d => Math.pow(d.classification - mean, 2))
      )
        );

        bands.push({
            timestamp: formatTime(data[i].timestamp),
            ma: mean,
            low: mean - (k * stdDev),
            higth: mean + (k * stdDev)
        });
    }

    return bands;
};

const getUserSpikes = (bbData, userData) => {
    const emotionsSike = [];

    userData.forEach(el => {
        const date = moment(el.timestamp).format('HH:mm:ss');
        const sameTimeArr = bbData.filter(bbEl => moment(bbEl.timestamp).format('HH:mm:ss') === date);

        if (sameTimeArr.length) {
            sameTimeArr.forEach(data => {
                if (el.classification >= data.higth || el.classification <= data.low) {
                    emotionsSike.push({
                        timestamp: el.timestamp,
                        classification: el.classification
                    });
                }
            });
        }
    });

    return emotionsSike;
};

const getMinMax = arr => {
    return { min: Math.min(...arr),
        max: Math.max(...arr) };
};

const createXAxis = chart => {
    const dateAxis = chart.xAxes.push(new am4charts.DateAxis());

    // This creates an accuracy of 1 millisecond for data
    dateAxis.baseInterval = { count: 1,
        timeUnit: 'millisecond' };
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
};

const createYAxis = chart => {
    const yAxis = chart.yAxes.push(new am4charts.ValueAxis());

    yAxis.renderer.grid.template.strokeWidth = 0;
    yAxis.cursorTooltipEnabled = false;
    yAxis.renderer.minGridDistance = 1;

    yAxis.renderer.grid.template.disabled = true;
    yAxis.renderer.labels.template.disabled = true;

    function createCustomLabels(value) {
        const range = yAxis.axisRanges.create();

        range.value = value;
        range.dy = -10;
        const emojiObj = {
            '1': '<div class="emotional-chart-emoji">🙂</div>',
            '0': '<div class="emotional-chart-emoji">😐</div>',
            '-1': '<div class="emotional-chart-emoji">🙁</div>'
        };

        range.label.html = emojiObj[value];
    }

    const customTicks = [ 1, 0, -1 ];

    customTicks.map(el => createCustomLabels(el));

    return yAxis;
};

const createUserEmotionGradient = () => {
    const gradient = new am4core.LinearGradient();

    gradient.addColor(am4core.color('#540d6e'));
    gradient.addColor(am4core.color('#983493'));
    gradient.addColor(am4core.color('#ff1a1a'));
    gradient.addColor(am4core.color('#ff8317'));
    gradient.addColor(am4core.color('#ffdd21'));
    gradient.gradientUnits = 'userSpaceOnUse';
    gradient.rotation = 270;

    return gradient;
};

const createUserSeries = chart => {
    const userSeries = chart.series.push(new am4charts.LineSeries());
    const gradient = createUserEmotionGradient();

    userSeries.dateFormatter = new am4core.DateFormatter();
    userSeries.dateFormatter.dateFormat = 'hh:mm:ss';
    userSeries.dataFields.valueY = 'classification';
    userSeries.dataFields.dateX = 'timestamp';
    userSeries.name = 'user';
    userSeries.fill = gradient;
    userSeries.stroke = gradient;
    userSeries.strokeWidth = 1;
    userSeries.fillOpacity = 0.6;

    return userSeries;
};

const createSpikesSerie = chart => {
    const emotionsSpikesSerie = chart.series.push(new am4charts.LineSeries());

    emotionsSpikesSerie.dateFormatter = new am4core.DateFormatter();
    emotionsSpikesSerie.dateFormatter.dateFormat = 'hh:mm:ss';
    emotionsSpikesSerie.dataFields.valueY = 'classification';
    emotionsSpikesSerie.dataFields.dateX = 'timestamp';
    emotionsSpikesSerie.name = 'spikes';
    emotionsSpikesSerie.strokeWidth = 0;

    const bullet = emotionsSpikesSerie.bullets.push(new am4charts.Bullet());

    // Add a circle user`s emotions spikes
    const circle = bullet.createChild(am4core.Circle);

    circle.horizontalCenter = 'middle';
    circle.verticalCenter = 'middle';
    circle.stroke = am4core.color(Colors.riffVioletMedium);
    circle.direction = 'top';
    circle.width = 10;
    circle.height = 10;
    circle.fill = am4core.color(Colors.riffVioletMedium);

    return emotionsSpikesSerie;
};

function EmotionsGraph({ data = [], participantId, startTime, endTime }) {
    const [ bandsData, setBandsData ] = useState([]);
    const [ currentUserData, setCurrentUserData ] = useState([]);
    const [ spikes, setSpikes ] = useState([]);
    const [ domainYxis, setDomainYAxis ] = useState({ min: -1,
        max: 1 });

    const chartRef = useRef(null);
    const emotionSpikesSeries = useRef(null);
    const userSeries = useRef(null);
    const yAxis = useRef(null);
    const dateAxis = useRef(null);

    const n = 20;
    const k = 2;

    const mapUserNamesToData = () => {
    // emotions data reduced by users: { [userId]: [arrayOfData] }
        const dataFormatted = data.reduce((acc, el) => {
            // for correct timeline we need time in unix format
            const elFormatted = {
                ...el,
                timestamp: formatTime(el.timestamp)
            };

            if (acc[el.participant_id]) {
                acc[el.participant_id].push(elFormatted);
            } else {
                acc[el.participant_id] = [ elFormatted ];
            }

            return acc;
        }, {});

        const arrUids = Object.keys(dataFormatted);
        const userData = dataFormatted[participantId] || [];

        setCurrentUserData(userData);

        if (arrUids.length > 1) {
            const bollingerBandsData = getBollingerBands(n, k, data) || [];
            const emotionSpikes = getUserSpikes(bollingerBandsData, userData) || [];
            const bbClassificationArr = bollingerBandsData.length
                // eslint-disable-next-line no-return-assign
                ? bollingerBandsData.reduce((acc, v) => acc = acc.concat([ v.low ]).concat([ v.higth ]), [])
                : [];
            const classificationArr = bbClassificationArr
        .concat(userData.length ? userData.map(el => el.classification) : [])
        .concat([ -1, 0, 1 ]);

            setBandsData(bollingerBandsData);
            setSpikes(emotionSpikes);
            setDomainYAxis(getMinMax(classificationArr));
        }
    };

    useEffect(() => {
        mapUserNamesToData();
    }, [ data, participantId ]);

    useEffect(() => {
        if (!chartRef.current) {
            am4core.options.commercialLicense = true;
            chartRef.current = am4core.create('emotion_chart', am4charts.XYChart);
            chartRef.current.hiddenState.properties.opacity = 0;

            chartRef.current.background.fill = Colors.white;
            chartRef.current.data = bandsData;

            // Add X Axis
            dateAxis.current = createXAxis(chartRef.current);

            // Add Y Axis
            yAxis.current = createYAxis(chartRef.current);

            // Create bollinger bands series
            const middleBBSeries = chartRef.current.series.push(new am4charts.LineSeries());

            middleBBSeries.dateFormatter = new am4core.DateFormatter();
            middleBBSeries.dateFormatter.dateFormat = 'hh:mm:ss';
            middleBBSeries.dataFields.dateX = 'timestamp';
            middleBBSeries.dataFields.valueY = 'ma';
            middleBBSeries.name = 'median';
            middleBBSeries.stroke = am4core.color(Colors.riffVioletDark);
            middleBBSeries.hiddenInLegend = true;

            const lowBBSeries = chartRef.current.series.push(new am4charts.LineSeries());

            lowBBSeries.dateFormatter = new am4core.DateFormatter();
            lowBBSeries.dateFormatter.dateFormat = 'hh:mm:ss';
            lowBBSeries.dataFields.dateX = 'timestamp';
            lowBBSeries.dataFields.valueY = 'low';
            lowBBSeries.stroke = am4core.color(Colors.riffVioletDark);
            lowBBSeries.name = 'low';
            lowBBSeries.hiddenInLegend = true;

            const upperBBSeries = chartRef.current.series.push(new am4charts.LineSeries());

            upperBBSeries.dataFields.dateX = 'timestamp';
            upperBBSeries.dataFields.valueY = 'higth';
            upperBBSeries.dataFields.openValueY = 'low';
            upperBBSeries.fillOpacity = 0.3;
            upperBBSeries.stroke = am4core.color(Colors.riffVioletDark);
            upperBBSeries.fill = am4core.color(Colors.riffVioletMedium);
            upperBBSeries.name = 'higth';

            // Add user`s emotions spikes series
            emotionSpikesSeries.current = createSpikesSerie(chartRef.current);

            // Add user`s emotions series
            userSeries.current = createUserSeries(chartRef.current);

            // Add scrollbar
            chartRef.current.scrollbarX = new am4core.Scrollbar();

            // Add chart cursor
            chartRef.current.cursor = new am4charts.XYCursor();
            chartRef.current.cursor.behavior = 'zoomX';
            chartRef.current.cursor.lineY.disabled = true;
        }

        return () => {
            chartRef.current && chartRef.current.dispose();
        };
    }, []);

    // Load data into chart
    useEffect(() => {

        if (chartRef.current && userSeries.current
      && emotionSpikesSeries.current && yAxis.current && dateAxis.current) {

            chartRef.current.data = bandsData;
            userSeries.current.data = currentUserData;
            emotionSpikesSeries.current.data = spikes;

            // add min/max to yAxis
            yAxis.current.min = domainYxis.min;
            yAxis.current.max = domainYxis.max;

            // add min/max to dateAxis
            dateAxis.current.min = new Date(startTime).getTime();
            dateAxis.current.max = new Date(endTime).getTime();
        }

    }, [ bandsData, currentUserData, spikes, domainYxis, startTime, endTime ]);

    // Handle component unmounting, dispose chart
    useEffect(() => () => {
        chartRef.current && chartRef.current.dispose();
    }, []);

    const getLegendItems = () => {
        const legendItems = [];

        const eventsSeries = [
            {
                title: 'Your Emotion Area',
                color: 'linear-gradient(180deg, rgba(255,131,23,1) 0%, rgba(255,26,26,1) 35%, rgba(84,13,110,1) 100%)'
            },
            {
                title: 'Participants Emotion Area',
                color: 'rgb(147, 117, 158, 0.3)'
            },
            {
                title: 'Your Emotion Spike',
                color: Colors.riffVioletMedium
            }
        ];

        eventsSeries.forEach((series, index) => {
            legendItems.push(
                <div
                    className = 'emotion-legend-item'
                    key = { `emotion-legend-item-${index}` }>
                    <span
                        className = 'peer-color'
                        style = {{ background: series.color }} />
                    <span className = 'legend-label'>
                        {series.title}
                    </span>
                </div>
            );
        });

        return legendItems;
    };

    return (
        <>
            <div
                className = 'amcharts-graph-container timeline-plot-div'
                id = 'emotion_chart'
                style = {{ width: '100%' }} />
            <div className = 'emotion-legend-wrapper'>
                <div className = 'emotion-legend-container'>
                    {getLegendItems()}
                </div>
            </div>
        </>
    );
}

EmotionsGraph.propTypes = {
    data: PropTypes.array.isRequired,
    endTime: PropTypes.instanceOf(Date),
    participantId: PropTypes.string.isRequired,
    startTime: PropTypes.instanceOf(Date)

};

export default EmotionsGraph;
