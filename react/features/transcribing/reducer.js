
import { ReducerRegistry } from '../base/redux';

import {
    _DIAL_ERROR,
    _TRANSCRIBER_JOINED,
    _TRANSCRIBER_LEFT,
    _POTENTIAL_TRANSCRIBER_JOINED,
    DIAL_TRANSCRIBER,
    SET_PENDING_TRANSCRIBING_NOTIFICATION_UID
} from './actionTypes';

/**
 * Returns initial state for transcribing feature part of Redux store.
 *
 * @returns {{
 * isTranscribing: boolean,
 * isDialing: boolean,
 * transcriberJID: null,
 * potentialTranscriberJIDs: Array
 * }}
 * @private
 */
function _getInitialState() {
    return {
        /**
         * Indicates whether there is currently an active transcriber in the
         * room.
         *
         * @type {boolean}
         */
        isTranscribing: false,

        /**
         * Indicates whether the transcriber has been dialed into the room and
         * we're currently awaiting successful joining or failure of joining.
         *
         * @type {boolean}
         */
        isDialing: false,

        /**
         * Indicates whether the transcribing feature is in the process of
         * terminating; the transcriber has been told to leave.
         */
        isTerminating: false,

        /**
         * The JID of the active transcriber.
         *
         * @type { string }
         */
        transcriberJID: null,

        /**
         * A list containing potential JID's of transcriber participants.
         *
         * @type { Array }
         */
        potentialTranscriberJIDs: []
    };
}

/**
 * Reduces the Redux actions of the feature features/transcribing.
 */
ReducerRegistry.register('features/transcribing',
    (state = _getInitialState(), action) => {
        if ([
            _TRANSCRIBER_JOINED,
            _TRANSCRIBER_LEFT,
            _POTENTIAL_TRANSCRIBER_JOINED,
            SET_PENDING_TRANSCRIBING_NOTIFICATION_UID
        ].includes(action.type)) {
            console.log('========================================');
            console.log('transcribing.reducer.action ----> ', action);
            console.log('transcribing.reducer.state ----> ', state);
            console.log('========================================');
        }

        switch (action.type) {
        case _TRANSCRIBER_JOINED:
            return {
                ...state,
                isTranscribing: true,
                isDialing: false,
                transcriberJID: action.transcriberJID
            };
        case _TRANSCRIBER_LEFT:
            return {
                ...state,
                isTerminating: false,
                isTranscribing: false,
                transcriberJID: undefined,
                potentialTranscriberJIDs: []
            };
        case _POTENTIAL_TRANSCRIBER_JOINED:
            return {
                ...state,
                potentialTranscriberJIDs:
                    [ action.transcriberJID ]
                        .concat(state.potentialTranscriberJIDs)
            };
        case SET_PENDING_TRANSCRIBING_NOTIFICATION_UID:
            return {
                ...state,
                pendingNotificationUid: action.uid
            };

        case DIAL_TRANSCRIBER:
            return {
                ...state,
                isDialing: true
            };
        case _DIAL_ERROR:
            return {
                ...state,
                isDialing: false,
                potentialTranscriberJIDs: []
            };
        default:
            return state;
        }
    });
