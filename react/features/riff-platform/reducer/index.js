import { metricsRedux } from '@rifflearning/riff-metrics';
import { combineReducers } from 'redux';

import { ReducerRegistry } from '../../base/redux';
import { LOGOUT } from '../constants/actionTypes';

import calendarSync from './calendarSync';
import localRecording from './localRecording';
import meeting from './meeting';
import meetingMediator from './meetingMediator';
import meetings from './meetings';
import personalMeeting from './personalMeeting';
import resetPassword from './resetPassword';
import riff from './riff';
import riffDataServer from './riffdataServer';
import scheduler from './scheduler';
import signIn from './signIn';
import signUp from './signUp';

const appReducer = combineReducers({
    signIn,
    signUp,
    meetings,
    meeting,
    scheduler,
    riff,
    resetPassword,
    meetingMediator,
    localRecording,
    riffDataServer,
    metrics: metricsRedux.reducer,
    personalMeeting,
    calendarSync
});

const rootReducer = (state, action) => {
    // clear all data in redux store to initial
    if (action.type === LOGOUT) {
        return appReducer(undefined, action);
    }

    return appReducer(state, action);
};

ReducerRegistry.register('features/riff-platform', rootReducer);
