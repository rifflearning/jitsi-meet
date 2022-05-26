/* @flow */

/* eslint-disable no-unused-vars */
/* eslint-disable flowtype/no-types-missing-file-annotation */

import WebmAdapter from '../components/WebmAdapter';
import {
    COMMAND_START,
    COMMAND_STOP,
    COMMAND_PING,
    COMMAND_PONG,
    PROPERTY_STATS,
    DEFAULT_RECORDING_FORMAT
} from '../constants';
import logger from '../logger';
import { downloadBlob } from '../recording';
import { sessionManager } from '../session';

/**
 * States of the {@code LocalRecordingController}.
 */
const ControllerState = Object.freeze({
    /**
     * Idle (not recording).
     */
    IDLE: Symbol('IDLE'),

    /**
     * Starting.
     */
    STARTING: Symbol('STARTING'),

    /**
     * Engaged (recording).
     */
    RECORDING: Symbol('RECORDING'),

    /**
     * Stopping."flowtype/no-types-missing-file-annotation": 0.
     */
    STOPPING: Symbol('STOPPING'),

    /**
     * Failed, due to error during starting / stopping process.
     */
    FAILED: Symbol('FAILED')
});

/**
 * Type of the stats reported by each participant (client).
 */
type LocalRecordingStats = {

    /**
     * Current local recording session token used by the participant.
     */
    currentSessionToken: number,

    /**
     * Whether local recording is engaged on the participant's device.
     */
    isRecording: boolean
}

/**
 *  The component responsible for the local recording.
 */
class LocalRecordingController {
    /**
     * For each recording session, there is a separate @{code RecordingAdapter}
     * instance so that encoded bits from the previous sessions can still be
     * retrieved after they ended.
     *
     * @private
     */
    _adapter = {};

    /**
     * The {@code JitsiConference} instance.
     *
     * @private
     */
    _conference: * = null;

    /**
     * Current recording session token.
     *
     * @private
     */
    _currentSessionToken: number = -1;

    /**
     * Current state of {@code LocalRecordingController}.
     *
     * @private
     */
    _state = ControllerState.IDLE;

    /**
     * Whether or not the audio is muted in the UI. This is stored as internal
     * state of {@code LocalRecordingController} because we might have recording
     * sessions that start muted.
     */
    _isMuted = false;

    /**
     * The ID of the active microphone.
     *
     * @private
     */
    _micDeviceId = 'default';

    /**
     * Current recording format.
     *
     * @private
     */
    _format = DEFAULT_RECORDING_FORMAT;

    /**
     * Whether or not the {@code LocalRecordingController} has registered for
     * XMPP events. Prevents initialization from happening multiple times.
     *
     * @private
     */
    _registered = false;

    /**
     * Current room name.
     *
     * @private
     */
    _meetingName = '';

    /**
     * Recording part of same session.
     *
     * @private
     */
    _recordingPart = 0;

    /**
     * FIXME: callback function for the {@code LocalRecordingController} to notify
     * UI it wants to display a notice. Keeps {@code LocalRecordingController}
     * decoupled from UI.
     */
    _onNotify: ?(messageKey: string, messageParams?: Object) => void;

    /**
     * FIXME: callback function for the {@code LocalRecordingController} to notify
     * UI it wants to display a warning. Keeps {@code LocalRecordingController}
     * decoupled from UI.
     */
    _onWarning: ?(messageKey: string, messageParams?: Object) => void;

    /**
     * FIXME: callback function for the {@code LocalRecordingController} to notify
     * UI that the local recording state has changed.
     */
    _onStateChanged: ?(boolean) => void;

    /**
     * Saves in the redux store user local recording state.
     */
    _onStatusUpdated: ?(boolean) => void;

    /**
     * FIXME: callback function for the {@code LocalRecordingController} to notify
     * UI it wants to display a dialog. Keeps {@code LocalRecordingController}
     * decoupled from UI.
     */
    _onMemoryExceeded: ?(boolean) => void;

    /**
     * Constructor.
     *
     * @returns {void}
     */
    constructor() {
        this.registerEvents = this.registerEvents.bind(this);
        this.getParticipantsStats = this.getParticipantsStats.bind(this);
        this._onStartCommand = this._onStartCommand.bind(this);
        this._onStopCommand = this._onStopCommand.bind(this);
        this._onPingCommand = this._onPingCommand.bind(this);
        this._doStartRecording = this._doStartRecording.bind(this);
        this._doStopRecording = this._doStopRecording.bind(this);
        this._updateStats = this._updateStats.bind(this);
        this._switchToNewSession = this._switchToNewSession.bind(this);

        this._startRecordingNotificationHandler = this._startRecordingNotificationHandler.bind(this);
        this._onStartNotification = this._onStartNotification.bind(this);
        this._stopRecordingNotificationHandler = this._stopRecordingNotificationHandler.bind(this);
        this._onStopNotification = this._onStopNotification.bind(this);
        this.onMemoryExceededDownload = this.onMemoryExceededDownload.bind(this);
        this.onNewParticipantAudioStreamAdded = this.onNewParticipantAudioStreamAdded.bind(this);
    }

    registerEvents: (*) => void;

    /**
     * Registers listeners for XMPP events.
     *
     * @param {JitsiConference} conference - A {@code JitsiConference} instance.
     * @param {string} meetingName - Conference room name.
     * @returns {void}
     */
    registerEvents(conference: Object, meetingName: string) {
        if (!this._registered) {
            this._conference = conference;
            this._meetingName = meetingName;
            if (this._conference) {
                this._conference
                    .addCommandListener(COMMAND_STOP, this._onStopNotification);
                this._conference
                    .addCommandListener(COMMAND_START, this._onStartNotification);
                this._conference
                    .addCommandListener(COMMAND_PING, this._onPingCommand);
                this._registered = true;
            }
            if (!this._conference.isModerator()) {
                this._conference.sendCommandOnce(COMMAND_PING, {});
            }
        }
    }

    /**
     * Sets the event handler for {@code onStateChanged}.
     *
     * @param {Function} delegate - The event handler.
     * @returns {void}
     */
    set onStateChanged(delegate: Function) {
        this._onStateChanged = delegate;
    }

    /**
     * Sets the event handler for {@code onStatusUpdated}.
     *
     * @param {Function} delegate - The event handler.
     * @returns {void}
     */
    set onStatusUpdated(delegate: Function) {
        this._onStatusUpdated = delegate;
    }

    /**
     * Sets the event handler for {@code onNotify}.
     *
     * @param {Function} delegate - The event handler.
     * @returns {void}
     */
    set onNotify(delegate: Function) {
        this._onNotify = delegate;
    }

    /**
     * Sets the event handler for {@code onWarning}.
     *
     * @param {Function} delegate - The event handler.
     * @returns {void}
     */
    set onWarning(delegate: Function) {
        this._onWarning = delegate;
    }

    /**
     * Sets the event handler for {@code onMemoryExceeded}.
     *
     * @param {Function} delegate - The event handler.
     * @returns {void}
     */
    set onMemoryExceeded(delegate: Function) {
        this._onMemoryExceeded = delegate;
    }

    /**
     * Signals the participant to start local recording.
     *
     * @returns {void}
     */
    startRecording() {
        this.registerEvents();
        this._onStartCommand({
            sessionToken: this._getRandomToken()
        });
    }

    /**
     * Signals the participant to stop local recording.
     *
     * @returns {void}
     */
    stopRecording() {
        this._onStopCommand();
    }

    /**
     * Triggers the download of recorded data.
     * Browser only.
     *
     * @param {number} sessionToken - The token of the session to download.
     * @returns {void}
     */
    downloadRecordedData(sessionToken: number) {
        const formattedMeetingName = this._meetingName.replace(/ /g, '_');

        if (this._onMemoryExceeded) {
            this._onMemoryExceeded(false);
        }

        if (this._adapter) {
            this._adapter.exportRecordedData()
                .then(args => {
                    const { data, format } = args;
                    const defineSessionPart = this._recordingPart ? `_${this._recordingPart}` : '';

                    const filename = `session_${sessionToken}${defineSessionPart
                    }_${formattedMeetingName}.${format}`;

                    downloadBlob(data, filename);
                })
                .catch(error => {
                    logger.error('Failed to download media for'
                        + ` session ${sessionToken}. Error: ${error}`);
                });
        } else {
            logger.error(`Invalid session token for download ${sessionToken}`);
        }
    }

    /**
     * Changes the current microphone.
     *
     * @param {string} micDeviceId - The new microphone device ID.
     * @returns {void}
     */
    setMicDevice(micDeviceId: string) {
        if (micDeviceId !== this._micDeviceId) {
            this._micDeviceId = String(micDeviceId);

            if (this._state === ControllerState.RECORDING) {

                logger.log('Before switching microphone...');
                this._adapter
                    .setMicDevice(this._micDeviceId)
                    .then(() => {
                        logger.log('Finished switching microphone.');

                    })
                    .catch(() => {
                        logger.error('Failed to switch microphone');
                    });
            }
            logger.log(`Switch microphone to ${this._micDeviceId}`);
        }
    }

    /**
     * Mute or unmute audio. When muted, the ongoing local recording should
     * produce silence.
     *
     * @param {boolean} muted - If the audio should be muted.
     * @returns {void}
     */
    setMuted(muted: boolean) {
        this._isMuted = Boolean(muted);

        if (this._state === ControllerState.RECORDING) {
            this._adapter.setMuted(this._isMuted);
        }
    }

    /**
     * Returns the local recording stats.
     *
     * @returns {LocalRecordingStats}
     */
    getLocalStats(): LocalRecordingStats {
        return {
            currentSessionToken: this._currentSessionToken,
            isRecording: this._state === ControllerState.RECORDING
        };
    }

    getParticipantsStats: () => *;

    /**
     * Returns the remote participants' local recording stats.
     *
     * @returns {*}
     */
    getParticipantsStats() {
        const members
            = this._conference.getParticipants()
            .map(member => {
                return {
                    id: member.getId(),
                    recordingStats:
                        JSON.parse(member.getProperty(PROPERTY_STATS) || '{}'),
                    isSelf: false
                };
            });

        // transform into a dictionary for consistent ordering
        const result = {};

        for (let i = 0; i < members.length; ++i) {
            result[members[i].id] = members[i];
        }
        const localId = this._conference.myUserId();

        result[localId] = {
            id: localId,
            recordingStats: this.getLocalStats(),
            isSelf: true
        };

        return result;
    }

    _changeState: (Symbol) => void;

    /**
     * Changes the current state of {@code LocalRecordingController}.
     *
     * @private
     * @param {Symbol} newState - The new state.
     * @returns {void}
     */
    _changeState(newState: Symbol) {
        if (this._state !== newState) {
            logger.log(`state change: ${this._state.toString()} -> `
                + `${newState.toString()}`);
            this._state = newState;
        }
    }

    _updateStats: () => void;

    /**
     * Sends out updates about the local recording stats via XMPP.
     *
     * @private
     * @returns {void}
     */
    _updateStats() {
        if (this._conference) {
            this._conference.setLocalParticipantProperty(PROPERTY_STATS,
                JSON.stringify(this.getLocalStats()));
        }
    }

    _onStartCommand: (*) => void;

    /**
     * Function for start local recording.
     *
     * @private
     * @param {*} sessionToken - The session token.
     * @returns {void}
     */
    _onStartCommand({ sessionToken }) {
        if (this._state === ControllerState.IDLE) {
            this._changeState(ControllerState.STARTING);
            this._switchToNewSession(sessionToken);
            this._doStartRecording();
        } else if (this._state === ControllerState.RECORDING
            && this._currentSessionToken !== sessionToken) {
            // There is local recording going on, but not for the same session.
            // , so we need to restart the recording.
            this._changeState(ControllerState.STOPPING);
            this._doStopRecording().then(() => {
                this._changeState(ControllerState.STARTING);
                this._switchToNewSession(sessionToken);
                this._doStartRecording();
            });
        }
    }

    _onStopCommand: (*) => void;

    /**
     * Function for stop local recording.
     *
     * @private
     * @returns {void}
     */
    _onStopCommand() {
        if (this._state === ControllerState.RECORDING) {
            this._changeState(ControllerState.STOPPING);
            this._doStopRecording();
        }
    }

    _onPingCommand: () => void;

    /**
     * Callback function for XMPP event.
     *
     * @private
     * @returns {void}
     */
    _onPingCommand() {
        if (this._conference) {
            logger.log('Received ping, sending pong.');
            this._conference.sendCommandOnce(COMMAND_PONG, {});
        }
    }

    /**
     * Generates a token that can be used to distinguish each local recording
     * session.
     *
     * @returns {number}
     */
    _getRandomToken() {
        return Math.floor(Math.random() * 100000000) + 1;
    }

    _doStartRecording: () => void;

    /**
     * Starts the recording locally.
     *
     * @private
     * @returns {void}
     */
    _doStartRecording() {
        if (this._state === ControllerState.STARTING) {
            const delegate = this._adapter;

            this._recordingPart = 0;

            delegate.start(this._micDeviceId, this._conference)
            .then(() => {
                this._changeState(ControllerState.RECORDING);
                sessionManager.beginSegment(this._currentSessionToken);
                logger.log('Local recording engaged.');

                // if (this._onNotify) {
                //     this._onNotify('Local recording engaged.');
                // }
                this._startRecordingNotificationHandler();

                delegate.setMuted(this._isMuted);
                this._onStatusUpdated(this.getLocalStats());
                this._updateStats();
            })
            .catch(err => {
                this._changeState(ControllerState.IDLE);
                logger.error('Failed to start local recording.', err);
            });
        }

    }
    _startRecordingNotificationHandler: () => void;

    /**
     * Signals the all participants about local recording engaged .
     *
     * @returns {void}
     */
    _startRecordingNotificationHandler() {
        if (this._conference) {
            this._conference.removeCommand(COMMAND_STOP);
            this._conference.sendCommand(COMMAND_START, {
                attributes: { sessionToken: this._currentSessionToken }
            });
        } else if (this._onWarning) {
            this._onWarning('Failed to send command');
        }
    }

    _onStartNotification: (*) => void;

    /**
     * Callback function for XMPP event.
     *
     * @private
     * @param {*} value - The event args.
     * @returns {void}
     */
    _onStartNotification(value) {
        //  const { sessionToken } = value.attributes;

        if (this._onStateChanged) {
            this._onStateChanged(true);
        }
    }

    _doStopRecording: () => Promise<void>;

    /**
     * Stops the recording locally.
     *
     * @private
     * @returns {Promise<void>}
     */
    _doStopRecording() {
        if (this._state === ControllerState.STOPPING) {
            const token = this._currentSessionToken;

            return this._adapter
                .stop()
                .then(() => {
                    this._changeState(ControllerState.IDLE);
                    sessionManager.endSegment(this._currentSessionToken);
                    logger.log('Local recording unengaged.');
                    if (this._recordingPart) {
                        this._recordingPart = this._recordingPart + 1;
                    }
                    this.downloadRecordedData(token);

                    const messageKey = 'Recording session {{token}} finished.';
                    const messageParams = {
                        token: this._currentSessionToken
                    };

                    if (this._onNotify) {
                        this._onNotify(messageKey, messageParams);
                    }

                    this._stopRecordingNotificationHandler();
                    this._onStatusUpdated(this.getLocalStats());
                    this._updateStats();
                })
                .catch(err => {
                    logger.error('Failed to stop local recording.', err);
                });
        }

        /* eslint-disable */
        return (Promise.resolve(): Promise<void>);
        // FIXME: better ways to satisfy flow and ESLint at the same time?
        /* eslint-enable */

    }

    // eslint-disable-next-line flowtype/no-types-missing-file-annotation
    _stopRecordingNotificationHandler: () => void;

    /**
     * Signals the all participants about local recording unengaged.
     *
     * @returns {void}
     */
    _stopRecordingNotificationHandler() {
        this.registerEvents();
        if (this._conference) {
            this._conference.removeCommand(COMMAND_START);
            this._conference.sendCommand(COMMAND_STOP, {
                attributes: { sessionToken: this._currentSessionToken }
            });
        } else if (this._onWarning) {
            this._onWarning('Failed to send command');
        }
    }

    // eslint-disable-next-line flowtype/no-types-missing-file-annotation
    _onStopNotification: (*) => void;

    /**
     * Callback function for XMPP event.
     *
     * @private
     * @param {*} value - The event args.
     * @returns {void}
     */
    _onStopNotification(value) {
        const { sessionToken } = value.attributes;
        const isAnyLocalRecordingSessionEngaged = this._checkIsAnyLocalRecordingSessionEngaged(sessionToken);

        if (this._onStateChanged && isAnyLocalRecordingSessionEngaged) {
            this._onStateChanged(false);
        }
    }

    /**
     * Checks if local recording sessions is engaged after some participant(by currentSessionToken) stopped recording .
     *
     * @param {string} currentSessionToken - The current session Token.
     * @returns {boolean}
     */
    _checkIsAnyLocalRecordingSessionEngaged(currentSessionToken) {

        const participantIdLocalRecordingEngaged = Object.values(this.getParticipantsStats())
            .filter(participant => participant.recordingStats && participant.recordingStats.isRecording);
        let isAnyLocalRecordingEnabled = true;

        participantIdLocalRecordingEngaged.forEach(participant => {
            if (participant.recordingStats && participant.recordingStats.currentSessionToken
                     && participant.recordingStats.currentSessionToken !== parseInt(currentSessionToken, 10)) {
                isAnyLocalRecordingEnabled = false;
            }
        });

        return isAnyLocalRecordingEnabled;
    }

    /**
     * Adds new audio stream to AudioContext.
     *
     * @param {MediaStream} newStream - The new participant audio stream.
     * @param {string} id - The new participant id.
     * @returns {void}
     */
    onNewParticipantAudioStreamAdded(newStream, id) {
        if (this._adapter.addNewParticipantAudioStream) {
            this._adapter.addNewParticipantAudioStream(newStream, id);
        }
    }

    /**
     * Triggers the download of recorded data in case memory limit exceeded.
     * Restarts MediaRecorder.
     *
     * @returns {void}
     */
    onMemoryExceededDownload() {
        return this._adapter
            .handleMemoryExceededStop()
            .then(() => {
                this.downloadRecordedData(this._currentSessionToken);
                this._adapter.onRecordingRestart();
                this._recordingPart = this._recordingPart + 1;
            })
            .catch(err => {
                logger.error('Failed to stop local recording.', err);
            });
    }

    // eslint-disable-next-line flowtype/no-types-missing-file-annotation
    _switchToNewSession: (string) => void;

    /**
     * Switches to a new local recording session.
     * RecordingController.registerEvents.
     *
     * @param {string} sessionToken - The session Token.
     * @returns {void}
     */
    _switchToNewSession(sessionToken) {
        this._currentSessionToken = sessionToken;
        logger.log(`New session: ${this._currentSessionToken}, `
            + `format: ${this._format}`);
        this._adapter = new WebmAdapter();
        sessionManager.createSession(sessionToken, this._format);
    }

    /**
     * Function for removing audio source from AudioContext.
     *
     * @param {string} id - Participant id.
     * @returns {void}
     */
    removeParticipantAudioStream(id) {
        if (this._adapter.removeAudioStreamsById) {
            this._adapter.removeAudioStreamsById(id);
        }
    }
}

/**
 * Global singleton of {@code LocalRecordingController}.
 */
export const recordingController = new LocalRecordingController();
