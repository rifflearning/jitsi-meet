/* ******************************************************************************
 * dashboard.js                                                                 *
 * *************************************************************************/ /**
 *
 * @fileoverview Selectors to access dashboard settings
 *
 * Created on       March 31, 2020
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2020-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import { GraphConfigs } from '../../libraries/utils/constants';


/* ******************************************************************************
 * getSelectedMeeting                                                      */ /**
 *
 * Get the meeting that is currently selected on the dashboard or null if
 * no meeting is selected.
 *
 * @param {Object} state
 * @returns {?RiffMeeting}
 */
function getSelectedMeeting(state) {
    return APP.store.getState()['features/riff-metrics'].selectedMeeting || {};

    return state.dashboard.selectedMeeting;
}

/* ******************************************************************************
 * getGraphDataset                                                         */ /**
 *
 * Get the dataset for the given dataset type.
 *
 * @param {Object} state
 * @param {GraphDatasetTypes} datasetType
 * @returns {{status: EStatus, data: Object | Array | null}}
 */
function getGraphDataset(state, datasetType) {
    const graphDatasets = APP.store.getState()['features/riff-metrics'].graphDatasets || {};

    return graphDatasets[datasetType];

    return state.dashboard.graphDatasets[datasetType];
}

/* ******************************************************************************
 * getDatasetForGraph                                                      */ /**
 *
 * Get the graph dataset for the given graph type.
 *
 * @param {Object} state
 * @param {GraphTypes} graphType
 * @returns {{status: EStatus, data: Object | Array | null}}
 */
function getDatasetForGraph(state, graphType) {
    return getGraphDataset(state, GraphConfigs[graphType].datasetType);
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    getDatasetForGraph,
    getGraphDataset,
    getSelectedMeeting
};
