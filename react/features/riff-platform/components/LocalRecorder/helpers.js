/* eslint-disable require-jsdoc */

import { COMMAND_START, COMMAND_STOP, PROPERTY_STATS } from './LocalRecorderController';


// Determine if the browser supports screen sharing
function isScreenShareSourceAvailable() {
    return Boolean(navigator.getDisplayMedia
              || navigator.mediaDevices.getDisplayMedia
              || navigator.mediaDevices.getSupportedConstraints().mediaSource);
}

class AudioStreamsMixer {

    initializeAudioContext(streamsArr) {
        this.audioContext = new AudioContext();
        this.dest = this.audioContext.createMediaStreamDestination();
        this.sources = [];

        streamsArr.length && streamsArr.forEach(stream => {
            if (stream.stream.getAudioTracks().length) {
                this.addStream(stream);
            }
        });
    }

    addStream({ stream, id }) {
        const sources = stream.getAudioTracks().map(track =>
            this.audioContext.createMediaStreamSource(new MediaStream([ track ])));

        sources.forEach(source => {

            // Add new source to the current sources being mixed
            this.sources.push({ id,
                source });
            source.connect(this.dest);

        });
    }

    getAudioTracks() {
        return this.dest.stream.getAudioTracks();
    }

    flushAllSources() {
        this.sources.forEach(source => {
            source.source.disconnect(this.dest);
        });

        this.sources = [];
    }

    cleanup() {
        this.audioContext.close();
    }

    removeAudioSouce(id) {
        const sources = [];

        this.sources.forEach(source => {
            if (source.id === id) {
                source.source.disconnect(this.dest);
            } else {
                sources.push(source);
            }
        });

        this.sources = sources;
    }
}

const audioStreamsMixer = new AudioStreamsMixer();

export const addNewAudioStream = (newParticipantStream, id) => {
    audioStreamsMixer.addStream({ stream: newParticipantStream,
        id });
};

export const removeAudioStream = id => audioStreamsMixer.removeAudioSouce(id);

export const cleanupAudioContext = () => {
    audioStreamsMixer.flushAllSources();
    audioStreamsMixer.cleanup();
};

const createDesktopTrack = () => {

    const getDesktopStreamPromise = navigator.mediaDevices.getDisplayMedia({ video: { displaySurface: 'browser' },
        audio: false });

    return getDesktopStreamPromise.then(desktopStream => desktopStream, error => {
        throw new Error(error);
    });
};

export const getCombinedStream = async participantStreams => {
    if (!isScreenShareSourceAvailable()) {
        throw new Error('Screen sharing is not supported in this browser.');
    }

    return createDesktopTrack().then(desktopStream => {
        audioStreamsMixer.initializeAudioContext(participantStreams);
        const audioTrack = audioStreamsMixer.getAudioTracks() || [];

        return new MediaStream(desktopStream.getVideoTracks().concat(audioTrack));
    })
    .catch(error => Promise.reject(error));
};

export const stopLocalVideo = recorderStream => recorderStream.getAudioTracks().forEach(track => track.stop());

export const stopLocalRecordingHandling = user => {

    const userLocRecStats = user?._properties && user._properties[PROPERTY_STATS];
    const checkUserLocalRecordingStatus = JSON.parse(userLocRecStats || null);

    if (checkUserLocalRecordingStatus?.isRecording) {
        user._conference.removeCommand(COMMAND_START);
        user._conference.sendCommand(COMMAND_STOP, {
            attributes: {
                sessionToken: checkUserLocalRecordingStatus.currentSessionToken
            }
        });
    }
};

export const createUserAudioTrack = () => {

    const getUserAudioStreamPromise = navigator.mediaDevices.getUserMedia({ video: false,
        audio: true });

    return getUserAudioStreamPromise.then(audioStream => audioStream, error => {
        throw new Error(error);
    });
};
