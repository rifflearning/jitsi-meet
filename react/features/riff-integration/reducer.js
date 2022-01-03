/* ******************************************************************************
 * reducer.js                                                                   *
 * *************************************************************************/ /**
 *
 * @fileoverview redux reducer for riff-integration state
 *
 * The reducer is added to the jitsi reducers using the ReducerRegistry
 * so this file exports nothing.
 *
 * Created on       January 3, 2022
 * @author          Jordan Reedie
 *
 * @copyright (c) 2022 Riff Analytics,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import { ReducerRegistry } from '../base/redux';

import { RIFF_SET_ACCESS_TOKEN, RIFF_SET_MEETING_ID } from './actionTypes';

const INITIAL_STATE = {
    accessToken: null,
    meetingId: null,
};

ReducerRegistry.register('features/riff-integration', (state = INITIAL_STATE, action) => {
    switch (action.type) {

    case RIFF_SET_ACCESS_TOKEN:
        return {
            ...state,
            accessToken: action.accessToken,
        };

    case RIFF_SET_MEETING_ID:
        return {
            ...state,
            meetingId: action.meetingId,
        };

    default:
        return state;
    }
});
