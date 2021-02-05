/* eslint-disable no-unused-vars */
/* @flow */

import { i18next } from '../../../base/i18n';
import { connect } from '../../../base/redux';
import logger from '../../../local-recording/logger';
import { downloadBlob } from '../../../local-recording/recording';
import { sessionManager } from '../../../local-recording/session';

import WebmAdapter from './WebmAdapter';

/**
 * XMPP command for signaling the start of local recording to all clients.
 */
export const COMMAND_START = 'localRecStart';

/**
 * XMPP command for signaling the stop of local recording to all clients.
 */
export const COMMAND_STOP = 'localRecStop';

/**
 * This is a workaround for newly-joined clients to receive remote presence.
 */
const COMMAND_PING = 'localRecPing';

/**
 * One-time command sent upon receiving a {@code COMMAND_PING}.
 * Only the moderator sends this command.
 * This command does not carry any information itself, but rather forces the
 * XMPP server to resend the remote presence.
 */
const COMMAND_PONG = 'localRecPong';

/**
 * Participant property key for local recording stats.
 */
const PROPERTY_STATS = 'localRecStats';

/**
 * Default recording format.
 */
const DEFAULT_RECORDING_FORMAT = 'webm';

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
     * Stopping.
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
    isRecording: boolean,

    /**
     * Total recorded bytes. (Reserved for future use.)
     */
    recordedBytes: number,

    /**
     * Total recording duration. (Reserved for future use.)
     */
    recordedLength: number
}

/**
 * The component responsible for the coordination of local recording, across
 * multiple participants.
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
    }

    registerEvents: (*) => void;

    /**
     * Registers listeners for XMPP events.
     *
     * @param {JitsiConference} conference - A {@code JitsiConference} instance.
     * @returns {void}
     */
    registerEvents(conference: Object) {
        if (!this._registered) {
            this._conference = conference;
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
        this._onStopCommand({ sessionToken: this._currentSessionToken });
    }

    /**
     * Triggers the download of recorded data.
     * Browser only.
     *
     * @param {number} sessionToken - The token of the session to download.
     * @returns {void}
     */
    downloadRecordedData(sessionToken: number) {
        if (this._adapter) {
            this._adapter.exportRecordedData()
                .then(args => {
                    const { data, format } = args;

                    const filename = `session_${sessionToken}`
                        + `_${this._conference.myUserId()}.${format}`;

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
     * Switches the recording format.
     *
     * @param {string} newFormat - The new format.
     * @returns {void}
     */
    switchFormat(newFormat: string) {
        this._format = newFormat;
        logger.log(`Recording format switched to ${newFormat}`);

        // the new format will be used in the next recording session
    }

    /**
     * Returns the local recording stats.
     *
     * @returns {LocalRecordingStats}
     */
    getLocalStats(): LocalRecordingStats {
        return {
            currentSessionToken: this._currentSessionToken,
            isRecording: this._state === ControllerState.RECORDING,
            recordedBytes: 0,
            recordedLength: 0
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
            = this._conference.getParticipants() || []
            .map(member => {
                return {
                    id: member.getId(),
                    displayName: member.getDisplayName(),
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
            displayName: i18next.t('localRecording.me'),
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
     * @param {*} sessionToken - The session token.
     * @returns {void}
     */
    _onStopCommand({ sessionToken }) {
        if (this._state === ControllerState.RECORDING) {
            // FIX: comment temporary for stop recording on conference leave
        // && this._currentSessionToken === sessionToken)

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

            delegate.start(this._micDeviceId, this._conference)
            .then(() => {
                this._changeState(ControllerState.RECORDING);
                sessionManager.beginSegment(this._currentSessionToken);
                logger.log('Local recording engaged.');

                if (this._onNotify) {
                    this._onNotify('Local recording engaged.');
                }
                this._startRecordingNotificationHandler();

                delegate.setMuted(this._isMuted);
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
     * Signals the all participants to start local recording.
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

    _onStartNotification: (*) => void

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
                    this.downloadRecordedData(token);

                    const messageKey = 'Recording session {{token}} finished.';
                    const messageParams = {
                        token: this._currentSessionToken
                    };

                    if (this._onNotify) {
                        this._onNotify(messageKey, messageParams);
                    }

                    this._stopRecordingNotificationHandler();

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

    _stopRecordingNotificationHandler: () => void;

    /**
     * Signals the all participants to stop local recording.
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


    _switchToNewSession: (string) => void;

    /**
     * Switches to a new local recording session.
     *rEcordingController.registerEvents.
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

}

/**
 * Global singleton of {@code LocalRecordingController}.
 */
export const recordingController = new LocalRecordingController();
