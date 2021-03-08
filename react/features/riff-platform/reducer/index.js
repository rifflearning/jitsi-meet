import { combineReducers } from 'redux';

import { ReducerRegistry } from '../../base/redux';

import freezePing from './freezePing';
import localRecording from './localRecording';
import meeting from './meeting';
import meetingMediator from './meetingMediator';
import meetings from './meetings';
import resetPassword from './resetPassword';
import riff from './riff';
import scheduler from './scheduler';
import signIn from './signIn';
import signUp from './signUp';

ReducerRegistry.register('features/riff-platform',
  combineReducers({
      signIn,
      signUp,
      meetings,
      meeting,
      scheduler,
      riff,
      resetPassword,
      meetingMediator,
      localRecording,
      freezePing
  })
);
