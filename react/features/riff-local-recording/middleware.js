/* eslint-disable max-len */
/* @flow */

import { APP_WILL_UNMOUNT } from '../base/app/actionTypes';
import {
    CONFERENCE_JOINED,
    CONFERENCE_WILL_LEAVE
} from '../base/conference/actionTypes';
import { openDialog, hideDialog } from '../base/dialog/actions';
import { i18next } from '../base/i18n';
import { MEDIA_TYPE } from '../base/media';
import { SET_AUDIO_MUTED } from '../base/media/actionTypes';
import { PARTICIPANT_JOINED, PARTICIPANT_LEFT } from '../base/participants/actionTypes';
import { MiddlewareRegistry } from '../base/redux';
import { SETTINGS_UPDATED } from '../base/settings/actionTypes';
import { TRACK_ADDED } from '../base/tracks/actionTypes';
import {
    NOTIFICATION_TIMEOUT_TYPE,
    showNotification
} from '../notifications';
import {
    VIDEO_PLAYER_PARTICIPANT_NAME,
    YOUTUBE_PLAYER_PARTICIPANT_NAME
} from '../shared-video/constants';

import {
    LOCAL_RECORDING_ENGAGED,
    LOCAL_RECORDING_UNENGAGED
} from './actionTypes';
import {
    localRecordingEngaged,
    localRecordingUnengaged,
    localRecordingStats,
    setSharedVideoId
} from './actions';
import DownloadInfoDialog from './components/DownloadInfoDialog';
import { recordingController } from './controller/RecordingController';
import { createUserAudioTrack } from './helpers';

declare var APP: Object;
declare var config: Object;

MiddlewareRegistry.register(({ getState, dispatch }) => next => action => {
    const result = next(action);

    const isEngagedStatus = () => getState()['features/riff-local-recording'].isEngaged;
    const isRecordingStatus = () => getState()['features/riff-local-recording'].stats?.isRecording;

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
        const enableRiffLocalRecording = config.toolbarButtons
            && config.toolbarButtons.includes('localrecording');
        const isLocalRecordingEnabled = Boolean(
            enableRiffLocalRecording
            && typeof APP === 'object'
        );

        if (!isLocalRecordingEnabled) {
            break;
        }

        // realize the delegates on recordingController, allowing the UI to
        // react to state changes in recordingController.
        recordingController.onStateChanged = isEngaged => {
            const currentIsEngagedStatus = isEngagedStatus();

            if (isEngaged && !currentIsEngagedStatus) {
                dispatch(localRecordingEngaged());
            } else if (!isEngaged && currentIsEngagedStatus) {
                dispatch(localRecordingUnengaged());
            }
        };

        recordingController.onStatusUpdated = stats => {
            dispatch(localRecordingStats(stats));

            if (stats?.isRecording) {
                const { sharedVideoId } = getState()['features/riff-local-recording'];

                // if video sharing is turned on we need to record video audio by user microfon
                if (sharedVideoId) {
                    onSharingVideoAdded(sharedVideoId);
                }
            }
        };

        recordingController.onWarning = (messageKey, messageParams) => {
            dispatch(showNotification(getLocalRecordingMessage(messageKey, messageParams), NOTIFICATION_TIMEOUT_TYPE.MEDIUM));
        };

        recordingController.onNotify = (messageKey, messageParams) => {
            dispatch(showNotification(getLocalRecordingMessage(messageKey, messageParams), NOTIFICATION_TIMEOUT_TYPE.MEDIUM));
        };

        recordingController.onMemoryExceeded = isExceeded => {
            dispatch((isExceeded ? openDialog : hideDialog)(DownloadInfoDialog));
        };

        const { room: meetingRoomName, conference } = getState()['features/base/conference'];

        recordingController.registerEvents(conference, meetingRoomName);

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
        const isRecording = isRecordingStatus();
        const { conference } = getState()['features/base/conference'];
        const { track } = action;

        if (!track || track.local || !isRecording || !conference) {
            return;
        }

        if (track.jitsiTrack && track.jitsiTrack.getType() === MEDIA_TYPE.AUDIO) {
            recordingController.onNewParticipantAudioStreamAdded(track.jitsiTrack.stream, track.participantId);
        }
        break;
    }

    case CONFERENCE_WILL_LEAVE: {
        if (isRecordingStatus()) {
            recordingController.stopRecording();
        }
        break;
    }

    case PARTICIPANT_JOINED: {
        const participant = action.participant;

        if (participant.name === VIDEO_PLAYER_PARTICIPANT_NAME
        || participant.name === YOUTUBE_PLAYER_PARTICIPANT_NAME) {
            dispatch(setSharedVideoId(participant.id));
            if (isRecordingStatus()) {
                onSharingVideoAdded(participant.id);
            }
        }

        break;
    }

    case PARTICIPANT_LEFT: {
        if (isRecordingStatus()) {
            recordingController.removeParticipantAudioStream(action.participant.id);
        }
        const { sharedVideoId } = getState()['features/riff-local-recording'];

        if (sharedVideoId === action.participant.id) {
            dispatch(setSharedVideoId(''));
        }
        break;

    }

    case LOCAL_RECORDING_ENGAGED: {
        dispatch(showNotification(getLocalRecordingMessage('Local recording has started.'), NOTIFICATION_TIMEOUT_TYPE.MEDIUM));
        break;
    }

    case LOCAL_RECORDING_UNENGAGED: {
        dispatch(showNotification(getLocalRecordingMessage('Local recording has stopped.'), NOTIFICATION_TIMEOUT_TYPE.MEDIUM));
        break;
    }
    }

    return result;
});
