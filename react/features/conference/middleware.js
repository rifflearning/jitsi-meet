// @flow
import { appNavigate } from '../app/actions';
import {
    CONFERENCE_JOINED,
    KICKED_OUT,
    conferenceLeft,
    getCurrentConference
} from '../base/conference';
import { hideDialog, isDialogOpen } from '../base/dialog';
import { pinParticipant } from '../base/participants';
import { MiddlewareRegistry, StateListenerRegistry } from '../base/redux';
import { SET_REDUCED_UI } from '../base/responsive-ui';
import { FeedbackDialog } from '../feedback';
import { setFilmstripEnabled } from '../filmstrip';
import { showSalesforceNotification } from '../salesforce/actions';
import { setToolboxEnabled } from '../toolbox/actions';

import { notifyKickedOut } from './actions';

/**
 * The local participant property which is used to set whether the local
 * participant wants to have a transcriber in the room.
 */
const P_NAME_REQUESTING_TRANSCRIPTION = 'requestingTranscription';

MiddlewareRegistry.register(store => next => action => {
    const result = next(action);

    switch (action.type) {
    case CONFERENCE_JOINED:
        _conferenceJoined(store);

        break;

    case SET_REDUCED_UI: {
        _setReducedUI(store);

        break;
    }

    case KICKED_OUT: {
        const { dispatch } = store;

        dispatch(notifyKickedOut(
            action.participant,
            () => {
                dispatch(conferenceLeft(action.conference));
                dispatch(appNavigate(undefined));
            }
        ));

        break;
    }
    }

    return result;
});

/**
 * Set up state change listener to perform maintenance tasks when the conference
 * is left or failed, close all dialogs and unpin any pinned participants.
 */
StateListenerRegistry.register(
    state => getCurrentConference(state),
    (conference, { dispatch, getState }, prevConference) => {
        const { authRequired, membersOnly, passwordRequired }
            = getState()['features/base/conference'];

        if (conference !== prevConference) {
            // Unpin participant, in order to avoid the local participant
            // remaining pinned, since it's not destroyed across runs.
            dispatch(pinParticipant(null));

            // XXX I wonder if there is a better way to do this. At this stage
            // we do know what dialogs we want to keep but the list of those
            // we want to hide is a lot longer. Thus we take a bit of a shortcut
            // and explicitly check.
            if (typeof authRequired === 'undefined'
                    && typeof passwordRequired === 'undefined'
                    && typeof membersOnly === 'undefined'
                    && !isDialogOpen(getState(), FeedbackDialog)) {
                // Conference changed, left or failed... and there is no
                // pending authentication, nor feedback request, so close any
                // dialog we might have open.
                dispatch(hideDialog());
            }
        }
    });

/**
 * Configures the UI. In reduced UI mode some components will
 * be hidden if there is no space to render them.
 *
 * @param {Store} store - The redux store in which the specified {@code action}
 * is being dispatched.
 * @private
 * @returns {void}
 */
function _setReducedUI({ dispatch, getState }) {
    const { reducedUI } = getState()['features/base/responsive-ui'];

    dispatch(setToolboxEnabled(!reducedUI));
    dispatch(setFilmstripEnabled(!reducedUI));
}

/**
 * Does extra sync up on properties that may need to be updated after the
 * conference was joined.
 *
 * @param {Store} store - The redux store in which the specified {@code action}
 * is being dispatched.
 * @private
 * @returns {void}
 */
function _conferenceJoined({ dispatch, getState }) {
    _setReducedUI({
        dispatch,
        getState
    });


    // Always enable transcription because Riff requires it in order to collect utterance data
    _setRequestingTranscription({ getState }, true);

    dispatch(showSalesforceNotification());
}


/**
 * Set the local property 'requestingTranscription'. This will cause Jicofo
 * and Jigasi to decide whether the transcriber needs to be in the room.
 *
 * @param {Store} store - The redux store.
 * @param {boolean} enabled - The new state of the transcription.
 * @private
 * @returns {void}
 */
function _setRequestingTranscription({ getState }, enabled: boolean) {
    const state = getState();
    const { conference } = state['features/base/conference'];

    conference.setLocalParticipantProperty(
        P_NAME_REQUESTING_TRANSCRIPTION,
        enabled);
}
