// @flow

import { MiddlewareRegistry } from '../base/redux';

import {
    HIDDEN_PARTICIPANT_JOINED,
    HIDDEN_PARTICIPANT_LEFT,
    PARTICIPANT_UPDATED
} from './../base/participants';
import {
    _TRANSCRIBER_LEFT,
    DIAL_TRANSCRIBER,
    STOP_TRANSCRIBING
} from './actionTypes';
import {
    dialError,
    hidePendingTranscribingNotification,
    potentialTranscriberJoined,
    showPendingTranscribingNotification,
    showStoppedTranscribingNotification,
    showTranscribingError,
    transcriberJoined,
    transcriberLeft
} from './actions';

declare var APP: Object;

const TRANSCRIBER_DIAL_COMMAND = 'jitsi_meet_transcribe';
const TRANSCRIBER_DISPLAY_NAME = 'Transcriber';

/**
 * Implements the middleware of the feature transcribing.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
// eslint-disable-next-line no-unused-vars
MiddlewareRegistry.register(store => next => action => {
    const {
        isDialing,
        isTranscribing,
        transcriberJID,
        potentialTranscriberJIDs
    } = store.getState()['features/transcribing'];

    const { conference } = store.getState()['features/base/conference'];

    switch (action.type) {
    case _TRANSCRIBER_LEFT:
        store.dispatch(showStoppedTranscribingNotification());
        break;
    case HIDDEN_PARTICIPANT_JOINED:
        if (action.displayName
                && action.displayName === TRANSCRIBER_DISPLAY_NAME) {
            store.dispatch(transcriberJoined(action.id));
        } else {
            store.dispatch(potentialTranscriberJoined(action.id));
        }

        break;
    case HIDDEN_PARTICIPANT_LEFT:
        if (action.id === transcriberJID) {
            store.dispatch(transcriberLeft(action.id));
        }
        break;
    case PARTICIPANT_UPDATED: {
        const { participant } = action;

        if (potentialTranscriberJIDs.includes(participant.id)
            && participant.name === TRANSCRIBER_DISPLAY_NAME) {
            store.dispatch(transcriberJoined(participant.id));
            store.dispatch(hidePendingTranscribingNotification());
        }

        break;
    }
    case DIAL_TRANSCRIBER:
        if (!(isDialing || isTranscribing)) {
            store.dispatch(showPendingTranscribingNotification());
            console.log('TRANSCRIBER_DIAL_COMMAND -> called');
            APP.conference._room.dial(TRANSCRIBER_DIAL_COMMAND)
            .catch(
                error => {
                    console.log('TRANSCRIBER_DIAL_COMMAND -> error');
                    console.log(error);
                    store.dispatch(dialError());
                    store.dispatch(hidePendingTranscribingNotification());
                    store.dispatch(showTranscribingError());
                }
            )
            .then(() => {
                console.log('TRANSCRIBER_DIAL_COMMAND -> success');
            });
        }
        break;

    case STOP_TRANSCRIBING:
        if (isTranscribing) {
            const participant = conference.getParticipantById(transcriberJID);

            conference.room.kick(participant.getJid());
        }
        break;
    }

    return next(action);
});
