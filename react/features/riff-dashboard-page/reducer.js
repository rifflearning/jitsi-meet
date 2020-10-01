/* eslint-disable camelcase */
import { PersistenceRegistry, ReducerRegistry } from '../base/redux';

import * as actionTypes from './actionTypes';

// maybe delete?
PersistenceRegistry.register('features/riff-metrics', true, {
    roomId: '',
    userData: {}
});

const defaultState = {
    roomId: '',
    userData: {}
};

ReducerRegistry.register('features/riff-metrics', (state = defaultState, action) => {
    switch (action.type) {
    case actionTypes.SET_RIFF_SERVER_ROOM_ID: {
        return {
            ...state,
            roomId: action.payload
        };
    }
    case actionTypes.SET_RIFF_FIREBASE_CREDENTIALS: {
        return {
            ...state,
            userData: action.payload
        };
    }
    }

    return state;
});
