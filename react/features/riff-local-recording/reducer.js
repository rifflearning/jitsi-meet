import { ReducerRegistry } from '../base/redux';

import * as actionTypes from './actionTypes';

const DEFAULT_STATE = {
    /**
     * Is local recording engaged.
     *
     * @type {boolean}
     */
    isEngaged: false,

    /**
     * Local recording statistics.
     *
     * @public
     * @type {Object}
     */
    stats: undefined
};

ReducerRegistry.register('features/riff-local-recording', (state = DEFAULT_STATE, action) => {

    switch (action.type) {

    case actionTypes.LOCAL_RECORDING_ENGAGED: {
        return {
            ...state,
            isEngaged: true
        };
    }

    case actionTypes.LOCAL_RECORDING_UNENGAGED:
        return { ...DEFAULT_STATE };

    case actionTypes.LOCAL_RECORDING_STATS:
        return {
            ...state,
            stats: {
                ...action.stats
            }
        };
    case actionTypes.LOCAL_RECORDING_SET_SHARED_VIDEO_ID:
        return {
            ...state,
            sharedVideoId: action.id
        };
    default:
        return state;
    }
});
