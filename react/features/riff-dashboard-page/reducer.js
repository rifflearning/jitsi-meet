/* eslint-disable camelcase */
import { PersistenceRegistry, ReducerRegistry } from '../base/redux';

import * as actionTypes from './actionTypes';

// maybe delete?
PersistenceRegistry.register('features/riff-metrics', true, {
    roomId: '',
    uid: '',
    selectedMeeting: null
});

const defaultState = {
    uid: '',
    selectedMeeting: { _id: '' },
    graphDatasets: {
        meeting_stats: {
            status: 'loading',
            data: []
        }
    }
};

ReducerRegistry.register('features/riff-metrics', (state = defaultState, action) => {
    switch (action.type) {
    case actionTypes.SET_RIFF_SERVER_ROOM_ID: {
        return {
            ...state,
            roomId: action.payload
        };
    }
    case actionTypes.SET_JITSI_UID_FOR_RIFF_SERVER: {
        return {
            ...state,
            uid: action.payload
        };
    }
    case actionTypes.SET_JITSI_USERNAME_FOR_RIFF_SERVER: {
        return {
            ...state,
            userName: action.payload
        };
    }
    case actionTypes.SET_SELECTED_MEETING: {
        return {
            ...state,
            selectedMeeting: action.payload
        };
    }
    case actionTypes.DASHBOARD_FETCH_MEETING_STATS: {
        return {
            ...state,
            graphDatasets: {
                ...state.graphDatasets,
                meeting_stats: {
                    status: action.status,
                    data: action.meetingStats || []
                }
            }
        };
    }
    }

    return state;
});
