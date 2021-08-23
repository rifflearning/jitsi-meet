import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import PropTypes from 'prop-types';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { ScaleLoader } from 'react-spinners';


import API from '../../../api';
import ChartCard from '../ChartCard/ChartCard';
import { Colors } from '../colorHelper';
import { getSelectedMeeting } from '../utils';

import { GraphConfigs } from './../config';

const InterestingMoments = props => {
    const chartRef = useRef(null);
    const [ isLoaded, setIsLoaded ] = useState(false);
    const [ interestingMoments, setInterestingMoments ] = useState([]);

    const { meeting } = props;
    const config = GraphConfigs.interesting_moments;

    useEffect(() => {

        if (meeting) {
            API.fetchInterestingMoments(meeting._id).then(res => {
                setInterestingMoments(res.map(m => {
                    return {
                        userName: m.userName,
                        time: new Date(m.time)
                    };
                }));
            })
                .catch()
                .finally(() => setIsLoaded(true));
        }
    }, [ meeting ]);

    useLayoutEffect(() => {
        if (!isLoaded) {
            return;
        }

        const chart = am4core.create('interesting-moments-plot-div', am4charts.XYChart);

        chart.data = interestingMoments;
        chart.maskBullets = false;

        const xAxis = chart.xAxes.push(new am4charts.DateAxis());
        const yAxis = chart.yAxes.push(new am4charts.CategoryAxis());

        yAxis.dataFields.category = 'userName';

        xAxis.baseInterval = { count: 1,
            timeUnit: 'millisecond' };
        xAxis.renderer.tooltipLocation = 0;
        xAxis.cursorTooltipEnabled = true;
        xAxis.tooltipDateFormat = 'h:mm:ss a';

        xAxis.dateFormats.setKey('hour', 'h:mm a');
        xAxis.dateFormats.setKey('minute', 'h:mm a');
        xAxis.dateFormats.setKey('second', 'h:mm:ss a');
        xAxis.dateFormats.setKey('millisecond', 'h:mm:ss SSS a');
        xAxis.periodChangeDateFormats.setKey('hour', 'h:mm a');
        xAxis.periodChangeDateFormats.setKey('minute', 'h:mm a');
        xAxis.periodChangeDateFormats.setKey('second', 'h:mm:ss a');
        xAxis.periodChangeDateFormats.setKey('millisecond', 'h:mm:ss SSS a');

        xAxis.startTime = new Date(meeting.startTime).getTime();
        xAxis.endTime = new Date(meeting.endTime).getTime();
        xAxis.strictMinMax = true;
        xAxis.renderer.minGridDistance = 50;
        xAxis.dataFields.category = 'time';

        xAxis.renderer.grid.template.disabled = true;
        yAxis.renderer.grid.template.disabled = true;
        xAxis.renderer.axisFills.template.disabled = true;
        yAxis.renderer.axisFills.template.disabled = true;
        yAxis.renderer.ticks.template.disabled = true;
        xAxis.renderer.ticks.template.disabled = true;

        const series = chart.series.push(new am4charts.ColumnSeries());

        series.dateFormatter = new am4core.DateFormatter();
        series.dateFormatter.dateFormat = 'hh:mm:ss';

        series.dataFields.categoryY = 'userName';
        series.dataFields.dateX = 'time';
        series.columns.template.disabled = true;

        const bullet = series.bullets.push(new am4charts.Bullet());
        const image = bullet.createChild(am4core.Image);

        image.href = 'https://www.amcharts.com/lib/images/star.svg';
        image.width = 30;
        image.height = 30;
        image.horizontalCenter = 'middle';
        image.verticalCenter = 'middle';

        bullet.tooltipText = 'Interesting moment at {time.formatDate("hh:mm:ss a")}';
        bullet.strokeWidth = 3;

        bullet.fill = am4core.color(Colors.riffViolet);
        bullet.stroke = am4core.color('#ffffff');
        bullet.strokeOpacity = 0;

        bullet.adapter.add('tooltipY', (tooltipY, target) => -target.radius + 1);

        bullet.hiddenState.properties.scale = 0.01;
        bullet.hiddenState.properties.opacity = 1;

        const hoverState = bullet.states.create('hover');

        hoverState.properties.strokeOpacity = 1;

        chart.scrollbarX = new am4core.Scrollbar();

        chartRef.current = chart;

        return () => {
            chart.dispose();
        };
    }, [ isLoaded, interestingMoments ]);

    // eslint-disable-next-line react/no-multi-comp
    const getChartContent = () => {
        if (!isLoaded) {
            return (<div className = 'loading-overlay'>
                <ScaleLoader color = { Colors.lightRoyal } />
            </div>);
        }

        if (interestingMoments.length === 0) {
            return (
                <div
                    className = 'empty-graph-text'
                    key = 'empty-text'>{config.empty}</div>);
        }

        return <div className = 'amcharts-graph-container interesting-moments-plot-div' />;
    };

    return (
        <ChartCard
            chartCardId = { 'interesting-moments' }
            chartInfo = { config.info }
            title = { config.title }>
            {getChartContent()}
        </ChartCard>
    );
};

const mapStateToProps = state => {
    return {
        meeting: getSelectedMeeting(state)
    };
};

InterestingMoments.propTypes = {
    meeting: PropTypes.object
};

export default connect(mapStateToProps)(InterestingMoments);
