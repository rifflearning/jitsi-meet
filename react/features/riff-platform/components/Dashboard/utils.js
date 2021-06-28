import { riffUtils, metricsRedux } from '@rifflearning/riff-metrics';

const { logger } = riffUtils;

logger.setLogLevel('info');

const { RequestStatus } = metricsRedux.constants;
const {
    loadMetricDatasets,
    loadUserMeetings,
    selectMeeting,
    metricGraphLoaded
} = metricsRedux.actions;
const {
    getSelectedMeeting,
    getMetricDataset,
    getDatasetStatus,
    getAreAllChartsLoaded,
    getUserMeetings,
    getUserMeetingsError,
    getUserMeetingsStatus,
    getMetricDatasets
} = metricsRedux.selectors;

export {
    logger,
    RequestStatus,
    loadMetricDatasets,
    loadUserMeetings,
    selectMeeting,
    metricGraphLoaded,
    getSelectedMeeting,
    getMetricDataset,
    getDatasetStatus,
    getAreAllChartsLoaded,
    getUserMeetings,
    getUserMeetingsError,
    getUserMeetingsStatus,
    getMetricDatasets
};
