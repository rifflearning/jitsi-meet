/* eslint-disable camelcase */
import { PersistenceRegistry, ReducerRegistry } from '../base/redux';

import * as actionTypes from './actionTypes';

// maybe delete?
PersistenceRegistry.register('features/riff-emotions', true, {
    // emotionsData: {}
});

const defaultState = {
    emotionsData: {}
};

ReducerRegistry.register('features/riff-emotions', (state = defaultState, action) => {
    switch (action.type) {
    case actionTypes.SET_EMOTIONS_DATA: {
        const id = action.payload.participantId;
        const emotionObj = {};

        emotionObj[id] = action.payload;

        return {
            ...state,
            emotionsData: {
                ...state.emotionsData,
                ...emotionObj
            }
        };
    }
    }

    return state;
});
