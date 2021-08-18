/* ******************************************************************************
 * index.js                                                                     *
 * *************************************************************************/ /**
 *
 * @fileoverview React component container for meeting metrics (the dashboard)
 *
 * Created on       August 25, 2021
 * @author          Oliver Millard
 *
 * @copyright (c) 2021-present Riff Analytics,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import { ExperimentalDashboard } from '@rifflearning/riff-metrics';
import React from 'react';

import EmotionsChart from './Metrics/EmotionsChart';
import InterestingMoments from './Metrics/InterestingMoments';

const tallMetricRowStyle = { height: '450px' };

const jitsiExpMetrics = (
    <>
        <div
            className = 'metric-row'
            style = { tallMetricRowStyle }>
            <InterestingMoments />
        </div>
        <div
            className = 'metric-row'
            style = { tallMetricRowStyle }>
            <EmotionsChart />
        </div>
    </>
);

const DashboardPage = () => (
    <div>
        <ExperimentalDashboard
            children = { jitsiExpMetrics } />
    </div>
);

export default DashboardPage;
