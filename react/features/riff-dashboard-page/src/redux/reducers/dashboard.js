/* ******************************************************************************
 * dashboard.js                                                                 *
 * *************************************************************************/ /**
 *
 * @fileoverview Dashboard redux reducer function
 *
 * Handler for redux actions which modify the dashboard redux state.
 *
 * Created on       August 27, 2018
 * @author          Dan Calacci
 *
 * @copyright (c) 2018-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import { ActionTypes } from 'Redux/constants';
import { logger } from 'libs/utils';

import { EStatus, GraphDatasetTypes, GraphTypes } from 'libs/utils/constants';

const initialState = {
    selectedMeeting: null,
    dashboardGraphs: {
        [GraphTypes.PARTICIPANT_SCORE]: {
            status: EStatus.LOADING,
        },
        [GraphTypes.TIMELINE]: {
            status: EStatus.LOADING,
        },
        [GraphTypes.SPEAKING_TIME]: {
            status: EStatus.LOADING,
        },
        [GraphTypes.GROUPED_INFLUENCES]: {
            status: EStatus.LOADING,
        },
        [GraphTypes.GROUPED_INTERRUPTIONS]: {
            status: EStatus.LOADING,
        },
        [GraphTypes.GROUPED_AFFIRMATIONS]: {
            status: EStatus.LOADING,
        },
    },
    graphDatasets: {
        /**
         * An array of general stats about the participants in the selected meeting
         * @type {Array<{ participantId: string,
         *                name: string,
         *                lengthUtterances: number,
         *                numUtterances: number,
         *                meanLengthUtterances: number }>}
         */
        [GraphDatasetTypes.MEETING_STATS]: {
            status: EStatus.LOADING,
            data: null,
        },
        [GraphDatasetTypes.MEETINGS]: {
            status: EStatus.LOADING,
            message: 'Initial state, no meetings loaded',
            lastFetched: new Date('January 1, 2000 00:01:00'),
            data: [],
        },
        [GraphDatasetTypes.INFLUENCES]: {
            status: EStatus.LOADING,
            data: null,
        },
        [GraphDatasetTypes.INTERRUPTIONS]: {
            status: EStatus.LOADING,
            data: null,
        },
        [GraphDatasetTypes.UTTERANCE_TIMELINE]: {
            status: EStatus.LOADING,
            data: {
                utts: [],
                sortedParticipants: [],
                sortedUtterances: [],
                startTime: null,
                endTime: null,
            },
        },
        [GraphDatasetTypes.AFFIRMATIONS]: {
            status: EStatus.LOADING,
            data: null,
        },
    }
};

const dashboard = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.USER_LOGOUT:
            logger.debug('dashboard reducer: log out in dashboard');
            return initialState;

        case ActionTypes.DASHBOARD_FETCH_MEETINGS: {
            const now = new Date();
            switch (action.status) {
                case EStatus.LOADING:
                    // TODO: Figure out if fetching meetings always gets all the user's meetings
                    //       and replaces the current set of meetings, or if it should get "more"
                    //       meetings, and only be updating what is already loaded. I think that
                    //       should actually be a different action or maybe just status. -mjl 2019-5-21
                    return {
                        ...state,
                        graphDatasets: {
                            ...state.graphDatasets,
                            [GraphDatasetTypes.MEETINGS]: {
                                status: action.status,
                                message: action.message,
                                data: [],
                            },
                        }
                    };

                case EStatus.LOADED:
                    return {
                        ...state,
                        graphDatasets: {
                            ...state.graphDatasets,
                            [GraphDatasetTypes.MEETINGS]: {
                                status: action.status,
                                data: action.meetings,
                                message: action.message || 'Meetings successfully loaded',
                                lastFetched: now,
                            },
                        }
                    };

                case EStatus.ERROR:
                    return {
                        ...state,

                        ...state,
                        graphDatasets: {
                            ...state.graphDatasets,
                            [GraphDatasetTypes.MEETINGS]: {
                                ...state.graphDatasets[GraphDatasetTypes.MEETINGS],
                                status: action.status,
                                message: action.message,
                            },
                        }
                    };

                default:
                    // If the status is invalid, do nothing
                    logger.error('dashboard reducer: DASHBOARD_FETCH_MEETINGS invalid status: ' +
                                 `${action.status}`, action);
                    return state;
            }
        }

        case ActionTypes.DASHBOARD_SELECT_MEETING: {
            // Set the rendering status for the graphs to loading
            const dashboardGraphs = { ...state.dashboardGraphs };

            Object.keys(state.dashboardGraphs).map((graphType) => {
                dashboardGraphs[graphType].status = EStatus.LOADING;
            });

            return {
                ...state,
                selectedMeeting: action.meeting,
                dashboardGraphs,
            };
        }

        case ActionTypes.DASHBOARD_GRAPH_LOADED:
            return {
                ...state,
                dashboardGraphs: {
                    ...state.dashboardGraphs,
                    [action.graphType]: {
                        status: EStatus.LOADED,
                    },
                }
            };

        case ActionTypes.DASHBOARD_FETCH_MEETING_STATS: {
            switch (action.status) {
                case EStatus.LOADING:
                    // TODO: Figure out how selecting a meeting, and fetching the various metric
                    //       data should relate to one another and what should happen if some fail
                    //       and some succeed. -mjl 2019-5-21
                    return {
                        ...state,
                        graphDatasets: {
                            ...state.graphDatasets,
                            [GraphDatasetTypes.MEETING_STATS]: {
                                status: action.status,
                                data: null,
                            },
                        }
                    };

                case EStatus.LOADED:
                    return {
                        ...state,
                        graphDatasets: {
                            ...state.graphDatasets,
                            [GraphDatasetTypes.MEETING_STATS]: {
                                status: action.status,
                                data: action.meetingStats,
                            },
                        }
                    };

                case EStatus.ERROR:
                    return {
                        ...state,
                        graphDatasets: {
                            ...state.graphDatasets,
                            [GraphDatasetTypes.MEETING_STATS]: {
                                ...state.graphDatasets[GraphDatasetTypes.MEETING_STATS],
                                status: action.status,
                            },
                        }
                    };

                default:
                    // If the status is invalid, do nothing
                    logger.error('dashboard reducer: DASHBOARD_FETCH_MEETING_STATS invalid status: ' +
                                 `${action.status}`, action);
                    return state;
            }
        }

        case ActionTypes.DASHBOARD_FETCH_MEETING_AFFIRMATIONS: {
            switch (action.status) {
                case EStatus.LOADING:
                    // TODO: Figure out how selecting a meeting, and fetching the various metric
                    //       data should relate to one another and what should happen if some fail
                    //       and some succeed. -mjl 2019-5-21
                    return {
                        ...state,
                        graphDatasets: {
                            ...state.graphDatasets,
                            [GraphDatasetTypes.AFFIRMATIONS]: {
                                status: action.status,
                                data: null,
                            },
                        }
                    };

                case EStatus.LOADED:
                    return {
                        ...state,
                        graphDatasets: {
                            ...state.graphDatasets,
                            [GraphDatasetTypes.AFFIRMATIONS]: {
                                status: action.status,
                                data: action.affirmationsData,
                            },
                        }
                    };

                case EStatus.ERROR:
                    return {
                        ...state,
                        graphDatasets: {
                            ...state.graphDatasets,
                            [GraphDatasetTypes.AFFIRMATIONS]: {
                                ...state.graphDatasets[GraphDatasetTypes.AFFIRMATIONS],
                                status: action.status,
                            },
                        }
                    };

                default:
                    // If the status is invalid, do nothing
                    logger.error(`dashboard reducer: DASHBOARD_FETCH_MEETING_INTERRUPTIONS invalid status:
                        ${action.status}`, action);
                    return state;
            }
        }

        case ActionTypes.DASHBOARD_FETCH_MEETING_INTERRUPTIONS: {
            switch (action.status) {
                case EStatus.LOADING:
                    // TODO: Figure out how selecting a meeting, and fetching the various metric
                    //       data should relate to one another and what should happen if some fail
                    //       and some succeed. -mjl 2019-5-21
                    return {
                        ...state,
                        graphDatasets: {
                            ...state.graphDatasets,
                            [GraphDatasetTypes.INTERRUPTIONS]: {
                                status: action.status,
                                data: null,
                            },
                        }
                    };

                case EStatus.LOADED:
                    return {
                        ...state,
                        graphDatasets: {
                            ...state.graphDatasets,
                            [GraphDatasetTypes.INTERRUPTIONS]: {
                                status: action.status,
                                data: action.interruptionData,
                            },
                        }
                    };

                case EStatus.ERROR:
                    return {
                        ...state,
                        graphDatasets: {
                            ...state.graphDatasets,
                            [GraphDatasetTypes.INTERRUPTIONS]: {
                                ...state.graphDatasets[GraphDatasetTypes.INTERRUPTIONS],
                                status: action.status,
                            },
                        }
                    };

                default:
                    // If the status is invalid, do nothing
                    logger.error(`dashboard reducer: DASHBOARD_FETCH_MEETING_INTERRUPTIONS invalid status:
                        ${action.status}`, action);
                    return state;
            }
        }

        case ActionTypes.DASHBOARD_FETCH_MEETING_INFLUENCE: {
            switch (action.status) {
                case EStatus.LOADING:
                    // TODO: Figure out how selecting a meeting, and fetching the various metric
                    //       data should relate to one another and what should happen if some fail
                    //       and some succeed. -mjl 2019-5-21
                    return {
                        ...state,
                        graphDatasets: {
                            ...state.graphDatasets,
                            [GraphDatasetTypes.INFLUENCES]: {
                                status: action.status,
                                data: null,
                            },
                        }
                    };

                case EStatus.LOADED:
                    return {
                        ...state,
                        graphDatasets: {
                            ...state.graphDatasets,
                            [GraphDatasetTypes.INFLUENCES]: {
                                status: action.status,
                                data: action.influenceData,
                            },
                        }
                    };

                case EStatus.ERROR:
                    return {
                        ...state,
                        graphDatasets: {
                            ...state.graphDatasets,
                            [GraphDatasetTypes.INFLUENCES]: {
                                ...state.graphDatasets[GraphDatasetTypes.INFLUENCES],
                                status: action.status,
                            },
                        }
                    };

                default:
                    // If the status is invalid, do nothing
                    logger.error('dashboard reducer: DASHBOARD_FETCH_MEETING_INFLUENCE invalid status: ' +
                                 `${action.status}`, action);
                    return state;
            }
        }

        case ActionTypes.DASHBOARD_FETCH_MEETING_TIMELINE: {
            switch (action.status) {
                case EStatus.LOADING:
                    // TODO: Figure out how selecting a meeting, and fetching the various metric
                    //       data should relate to one another and what should happen if some fail
                    //       and some succeed. -mjl 2019-5-21
                    return {
                        ...state,
                        graphDatasets: {
                            ...state.graphDatasets,
                            [GraphDatasetTypes.UTTERANCE_TIMELINE]: {
                                status: action.status,
                                data: null,
                            }
                        },
                    };

                case EStatus.LOADED:
                    return {
                        ...state,
                        graphDatasets: {
                            ...state.graphDatasets,
                            [GraphDatasetTypes.UTTERANCE_TIMELINE]: {
                                ...state.graphDatasets[GraphDatasetTypes.UTTERANCE_TIMELINE],
                                status: action.status,
                                data: action.timelineData,
                            }
                        },
                    };

                case EStatus.ERROR:
                    return {
                        ...state,
                        graphDatasets: {
                            ...state.graphDatasets,
                            [GraphDatasetTypes.UTTERANCE_TIMELINE]: {
                                ...state.graphDatasets[GraphDatasetTypes.UTTERANCE_TIMELINE],
                                status: action.status,
                                data: action.timelineData,
                            }
                        },
                    };

                default:
                    // If the status is invalid, do nothing
                    logger.error('dashboard reducer: DASHBOARD_FETCH_MEETING_TIMELINE invalid status: ' +
                                 `${action.status}`, action);
                    return state;
            }
        }

        default:
            return state;
    }
};

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    dashboard,
};
