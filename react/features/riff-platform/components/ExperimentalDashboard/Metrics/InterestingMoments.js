import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import PropTypes from 'prop-types';
import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
import { connect } from 'react-redux';

import API from '../../../api';
import ChartCard from '../ChartCard/ChartCard';
import { getSelectedMeeting } from '../utils';

const InterestingMoments = props => {
    const chartRef = useRef(null);
    const [ interestingMoments, setInterestingMoments ] = useState([]);
    const { meeting } = props;

    useEffect(() => {
        if (meeting) {
            API.fetchInterestingMoments(meeting.room).then(res => {
                setInterestingMoments(res);
            });
        }
    }, [ meeting ]);

    useLayoutEffect(() => {
        const chart = am4core.create('interesting-moments-plot-div', am4charts.XYChart);

        chart.maskBullets = false;

        const xAxis = chart.xAxes.push(new am4charts.DateAxis());
        const yAxis = chart.yAxes.push(new am4charts.CategoryAxis());

        yAxis.dataFields.category = 'userName';
        xAxis.renderer.minGridDistance = 40;
        xAxis.dataFields.category = 'time';

        xAxis.renderer.grid.template.disabled = true;
        yAxis.renderer.grid.template.disabled = true;
        xAxis.renderer.axisFills.template.disabled = true;
        yAxis.renderer.axisFills.template.disabled = true;
        yAxis.renderer.ticks.template.disabled = true;
        xAxis.renderer.ticks.template.disabled = true;

        const series = chart.series.push(new am4charts.ColumnSeries());

        series.dataFields.categoryY = 'userName';
        series.dataFields.dateX = 'time';
        series.columns.template.disabled = true;
        series.sequencedInterpolation = true;

        // series.defaultState.transitionDuration = 3000;

        const bullet = series.bullets.push(new am4charts.Bullet());
        const image = bullet.createChild(am4core.Image);

        image.href = 'https://www.amcharts.com/lib/images/star.svg';
        image.width = 30;
        image.height = 30;
        image.horizontalCenter = 'middle';
        image.verticalCenter = 'middle';

        bullet.tooltipText = '{userName}, {time}: {value.workingValue.formatNumber(\'#.\')}';
        bullet.strokeWidth = 3;
        bullet.stroke = am4core.color('#ffffff');
        bullet.strokeOpacity = 0;

        bullet.adapter.add('tooltipY', (tooltipY, target) => -target.radius + 1);


        bullet.hiddenState.properties.scale = 0.01;
        bullet.hiddenState.properties.opacity = 1;

        const hoverState = bullet.states.create('hover');

        hoverState.properties.strokeOpacity = 1;

        chart.data = interestingMoments;

        chart.scrollbarX = new am4core.Scrollbar();
        chart.scrollbarX.parent = chart.bottomAxesContainer;

        chartRef.current = chart;

        return () => {
            chart.dispose();
        };
    }, [ interestingMoments ]);

    return (
        <ChartCard
            chartCardId = { 'interesting-moments' }
            chartInfo = { 'Interesting moments' }
            title = { 'Interesting moments' }>
            <div className = 'amcharts-graph-container interesting-moments-plot-div' />
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
