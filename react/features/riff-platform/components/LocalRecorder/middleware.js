/* @flow */

import { APP_WILL_UNMOUNT } from '../../../base/app/actionTypes';
import { CONFERENCE_JOINED, CONFERENCE_WILL_LEAVE } from '../../../base/conference/actionTypes';
import { openDialog, hideDialog } from '../../../base/dialog/actions';
import { i18next } from '../../../base/i18n';
import { SET_AUDIO_MUTED } from '../../../base/media/actionTypes';
import { PARTICIPANT_JOINED, PARTICIPANT_LEFT } from '../../../base/participants/actionTypes';
import { MiddlewareRegistry } from '../../../base/redux';
import { SETTINGS_UPDATED } from '../../../base/settings/actionTypes';
import { TRACK_ADDED } from '../../../base/tracks/actionTypes';
import { showNotification } from '../../../notifications/actions';
import { locRecordingEngaged, locRecordingStats, setSharedVideoId } from '../../actions/localRecording';

import DownloadInfoDialog from './DownloadInfoDialog';
import { recordingController } from './LocalRecorderController';
import { createUserAudioTrack } from './helpers';

declare var APP: Object;
declare var interfaceConfig: Object;

MiddlewareRegistry.register(({ getState, dispatch }) => next => action => {
    const result = next(action);


    const getRecordingStatus = () => getState()['features/riff-platform'].localRecording?.stats?.isRecording;

    const getLocalRecordingMessage = (messageKey, messageParams) => {
        return {
            title: i18next.t('localRecording.localRecording'),
            description: i18next.t(messageKey, messageParams)
        };
    };

    const onSharingVideoAdded = participantId => createUserAudioTrack()
        .then(audioStream => {
            recordingController.onNewParticipantAudioStreamAdded(audioStream, participantId);
        })
        .catch(error => console.log(error));

    switch (action.type) {
    case CONFERENCE_JOINED: {
        const enableRiffLocalRecording = interfaceConfig.TOOLBAR_BUTTONS.includes('rifflocalrecording');
        const isLocalRecordingEnabled = Boolean(
            enableRiffLocalRecording
            && typeof APP === 'object'
        );

        if (!isLocalRecordingEnabled) {
            break;
        }

        // realize the delegates on recordingController, allowing the UI to
        // react to state changes in recordingController.
        recordingController.onStateChanged = isEngaged => dispatch(locRecordingEngaged(isEngaged));

        recordingController.onStatusUpdated = stats => {
            dispatch(locRecordingStats(stats));

            if (stats?.isRecording) {
                const { sharedVideoId } = getState()['features/riff-platform'].localRecording;

                if (sharedVideoId) {
                    onSharingVideoAdded(sharedVideoId);
                }
            }
        };

        recordingController.onWarning = (messageKey, messageParams) => {
            dispatch(showNotification(getLocalRecordingMessage(messageKey, messageParams), 10000));
        };

        recordingController.onNotify = (messageKey, messageParams) => {
            dispatch(showNotification(getLocalRecordingMessage(messageKey, messageParams), 10000));
        };

        recordingController.onMemoryExceeded = isExceeded => {
            dispatch((isExceeded ? openDialog : hideDialog)(DownloadInfoDialog));
        };

        const { conference } = getState()['features/base/conference'];
        const meetingName = getState()['features/riff-platform']?.meeting?.meeting?.name;

        recordingController.registerEvents(conference, meetingName);

        break;
    }
    case APP_WILL_UNMOUNT:
        recordingController.onStateChanged = null;
        recordingController.onNotify = null;
        recordingController.onWarning = null;
        break;
    case SET_AUDIO_MUTED:
        recordingController.setMuted(action.muted);
        break;
    case SETTINGS_UPDATED: {
        const { micDeviceId } = getState()['features/base/settings'];

        if (micDeviceId) {
            recordingController.setMicDevice(micDeviceId);
        }
        break;
    }
    case TRACK_ADDED: {
        const isRecording = getRecordingStatus();
        const { conference } = getState()['features/base/conference'];
        const { track } = action;

        if (!track || track.local || !isRecording || !conference) {
            return;
        }

        if (track.jitsiTrack && track.jitsiTrack.getType() === 'audio') {
            recordingController.onNewParticipantAudioStreamAdded(track.jitsiTrack.stream, track.participantId);
        }
        break;
    }
    case CONFERENCE_WILL_LEAVE: {
        if (getRecordingStatus()) {
            recordingController.stopRecording();
        }
        break;
    }
    case PARTICIPANT_JOINED: {
        if (action.participant.name === 'YouTube') {
            dispatch(setSharedVideoId(action.participant.id));
            if (getRecordingStatus()) {
                onSharingVideoAdded(action.participant.id);
            }
        }

        break;
    }
    case PARTICIPANT_LEFT: {
        if (getRecordingStatus()) {
            recordingController.removeParticipantAudioStream(action.participant.id);
        }
        const { sharedVideoId } = getState()['features/riff-platform'].localRecording;

        if (sharedVideoId === action.participant.id) {
            dispatch(setSharedVideoId(''));
        }
        break;

    }
    }

    return result;
});
