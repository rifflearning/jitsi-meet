/* eslint-disable require-jsdoc */

import fixWebmDuration from 'fix-webm-duration';

import logger from '../../../local-recording/logger';
import { RecordingAdapter } from '../../../local-recording/recording';

import { recordingController } from './LocalRecorderController';
import { getCombinedStream, addNewAudioStream, removeAudioStream, cleanupAudioContext } from './helpers';


/**
 * The argument slices the recording into chunks, calling dataavailable every defined seconds.
 */
const MEDIARECORDER_TIMESLICE = 180000;

/**
 * Defined max size for blob(MB).
 */
const MEDIARECORDER_MAX_SIZE = 950;

/**
 * Recording adapter that uses {@code MediaRecorder}
 */
export default class WebmAdapter extends RecordingAdapter {

    /**
     * Instance of MediaRecorder.
     * @private
     */
    _mediaRecorder = null;

    /**
     * Initialization promise.
     * @private
     */
    _initPromise = null;

    /**
     * The recorded media file.
     * @private
     */
    _recordedData = [];

    /**
     * The recorded  stream.
     * @private
     */
    _recorderStream = null;

    /**
     * The {@code JitsiConference} instance.
     *
     * @private
     */
    _conference = null;

    /**
     * Instance of MediaRecorder.
     * @private
     */
    _newMediaRecorder = null;

    /**
     * Prevents initialization new MediadRecorder from happening multiple times.
     */
    _isCalled = false;

    _participantAudioStreams = [];

    /**
     * Time when recording started
     */
    _startTime = null;

    /**
     * Implements {@link RecordingAdapter#start()}.
     *
     * @inheritdoc
     */
    start(micDeviceId, conference) {
        this._conference = conference;

        if (!this._initPromise) {
            this._initPromise = this._initialize(micDeviceId);
        }

        return this._initPromise.then(() =>
            new Promise(resolve => {
                this._mediaRecorder.start(MEDIARECORDER_TIMESLICE);
                this._startTime = new Date();
                resolve();
            })
        );
    }

    /**
     * Implements {@link RecordingAdapter#stop()}.
     *
     * @inheritdoc
     */
    stop() {
        return new Promise(
            async resolve => {
                // eslint-disable-next-line no-negated-condition
                if (this._mediaRecorder.state !== 'inactive') {
                    this._mediaRecorder.stop(this._stopStreamTracks());
                    this._mediaRecorder.onstop = () => resolve();
                    this._mediaRecorder = null;
                } else {
                    this._stopStreamTracks();
                    this._mediaRecorder = null;
                    resolve();
                }
            }
        );
    }

    /**
     * Returns the remote participant id and audio stream.
      *@Private.
     *
     * @param {Object} participant - The participant object.
     * @returns {({Object}|undefined)} - The object with participant id and audio stream.
     */
    _getAudioParticipantStream(participant) {
        if (participant._tracks?.length) {
            return {
                id: participant._id,
                stream: participant._tracks.find(t => t.type === 'audio')?.stream
            };
        }
    }

    /**
     * Returns array of remote participants id and their audio stream.
     *@Private.
     *
     * @returns {(Object[])} - List of remote participants id and their audio stream.
     */
    _getAudioParticipantsStream() {
        const participantsAudioStreamArray = this._conference.getParticipants()
          .map(participant => this._getAudioParticipantStream(participant))
          .filter(participant => participant && participant.stream);

        return participantsAudioStreamArray;
    }

    /**
     * Implements {@link RecordingAdapter#exportRecordedData()}.
     *
     * @inheritdoc
     */
    exportRecordedData() {
        if (this._recordedData.length) {
            const blobData = new Blob(this._recordedData, { type: 'video/webm' });

            const duration = new Date() - this._startTime;

            return fixWebmDuration(blobData, duration, { logger: false }).then(fixedBlobData => Promise.resolve({
                data: fixedBlobData,
                format: 'webm'
            }));

        }

        return Promise.reject('No media data recorded.');
    }

    /**
     * Implements {@link RecordingAdapter#setMuted()}.
     *
     * @inheritdoc
     */
    setMuted(muted) {
        const shouldEnable = !muted;

        this._initialize();

        if (!this._stream) {
            return Promise.resolve();
        }

        const track = this._stream.getAudioTracks()[0];

        if (!track) {
            logger.error('Cannot mute/unmute. Track not found!');

            return Promise.resolve();
        }

        if (track.enabled !== shouldEnable) {
            track.enabled = shouldEnable;
            logger.log(muted ? 'Mute' : 'Unmute');
        }

        return Promise.resolve();
    }

    /**
     * Add new audio stream to AudioContext.
     *
     * @param {MediaStream} newAudioStream - The new participant audio stream.
     * @returns {void}
     */

    addNewParticipantAudioStream(newAudioStream, id) {
        if (newAudioStream.getAudioTracks().length) {
            addNewAudioStream(newAudioStream, id);
        }
    }

    /**
     * Initialize the adapter.
     *
     * @private
     * @param {string} micDeviceId - The current microphone device ID.
     * @returns {Promise}
     */
    _initialize(micDeviceId) {

        if (this._mediaRecorder) {
            return Promise.resolve();
        }

        return new Promise((resolve, error) => {
            this._getAudioStream(micDeviceId)
            .then(async userAudioStream => {
                const participatsStream = this._getAudioParticipantsStream() || [];
                const allParticipatsAudioStreams = participatsStream.concat({ id: 'local',
                    stream: userAudioStream });

                this._participantAudioStreams = allParticipatsAudioStreams;

                getCombinedStream(allParticipatsAudioStreams)
                .then(mediaStream => {
                    this._stream = userAudioStream;
                    this._initializeCurrentMediaRecoder(mediaStream);
                    this._recorderStream = mediaStream;

                    resolve();

                    this._recorderStream.getVideoTracks()[0].onended = () => {
                        logger.log('Capture stream inactive');

                        return recordingController.stopRecording();
                    };
                })
                .catch(err => {
                    logger.error(`Error calling getUserMedia(): ${err}`);
                    error();
                });
            })
            .catch(err => {
                logger.error(`Error calling getUserMedia(): ${err}`);
                error();
            });
        });
    }

    /**
     * Initialize the current MediaRecorder.
     *
     * @private
     * @param {MediaStream} stream - The current stream.
     * @returns {void}
     */
    _initializeCurrentMediaRecoder(stream) {
        this._mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
        this._mediaRecorder.ondataavailable = e => this._onMediaDataAvailable(e.data);
    }

    /**
     * Initialize the new MediaRecorder. To continue recording with current stream.
     *
     * @private
     * @param {MediaStream} stream - The current stream.
     * @returns {void}
     */
    _initializeNewMediaRecoder(stream) {
        this._newMediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
        this._newMediaRecorder.ondataavailable = e => this._onMediaDataAvailable(e.data);
    }


    /**
     * Stop MediaRecorder in case memory limit exceeded.
     *
     * @returns {void}
     */
    handleMemoryExceededStop() {
        return new Promise(
            async resolve => {
                this._mediaRecorder.onstop = () => resolve();
                this._mediaRecorder.stop();
            }
        );
    }

    /**
     * Restarts MediaRecorder with the same stream.
     *
     * @returns {void}
     */
    onRecordingRestart() {
        this._mediaRecorder = this._newMediaRecorder;
        this._mediaRecorder.start(MEDIARECORDER_TIMESLICE);
        this._mediaRecorder.requestData();
        this._newMediaRecorder = null;
        this._recordedData = [];
        this._isCalled = false;
        this._startTime = new Date();
    }


    /**
     * Callback for checking/storing the data.
     *
     * @private
     * @param {Blob} data - Encoded data.
     * @returns {void}
     */
    _onMediaDataAvailable(data) {
        const currentRecordingBlob = new Blob(this._recordedData, { type: 'video/webm' });
        const sizeInMB = currentRecordingBlob.size / (1024 * 1024);

        this._saveMediaData(data);
        if (sizeInMB >= MEDIARECORDER_MAX_SIZE
            && this._mediaRecorder
            && this._mediaRecorder.state === 'recording'
            && !this._isCalled) {

            if (recordingController._onMemoryExceeded) {
                recordingController._onMemoryExceeded(true);
            }
            this._initializeNewMediaRecoder(this._recorderStream);
            this._isCalled = true;
        }
    }

    _stopStreamTracks() {
        if (this._mediaRecorder) {
            this._mediaRecorder.stream.getTracks().forEach(track => track.stop());
        }
        cleanupAudioContext();
    }

    /**
     * Function for storing the data.
     *
     * @private
     * @param {Blob} data - Encoded data.
     * @returns {void}
     */
    _saveMediaData(data) {
        this._recordedData.push(data);
    }

    /**
     * Implements {@link RecordingAdapter#setMicDevice()}.
     *
     * @inheritdoc
     */
    setMicDevice(micDeviceId) {
        return this._replaceMic(micDeviceId);
    }

    removeAudioStreamsById(id) {
        removeAudioStream(id);
    }
}
