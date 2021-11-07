import { Client } from '@stomp/stompjs';


class AudioCapturer {
    constructor(room, roomId, userId, stream) {
        this._mediaType = "webm";
        this._rabbitMQ = null;
        this._room = room;
        this._roomId = roomId;
        this._userId = userId;
        this._getAudioTracksProperties(stream);
        this.context = new AudioContext({
            sampleRate: this._settings["sampleRate"],
        });
        this.mediaStream = this.context.createMediaStreamSource(stream);
    }

    /**
     * Creates socket connection and initialises capturing process
     * 
     * @param {String} rmqUrl - The url that socket will use to connect
     * @returns {void}
     */
    connect = async (rmqUrl) => {
        this._rabbitMQ = new Client({
            brokerURL: rmqUrl,
            connectHeaders: {
              login: 'guest',
              passcode: 'guest',
            }
        });
        this._rabbitMQ.activate();
        var recorder = this.context.createScriptProcessor(8192, 1, 1);
        recorder.onaudioprocess = this._onData;
        this.mediaStream.connect(recorder);
        recorder.connect(this.context.destination);
    }

    /**
     * Creates settings object with required MediaTrackSettings
     * 
     * @param {MediaStream} stream - Used audio stream
     * @returns {void}
     */
    _getAudioTracksProperties = (stream) => {
        const settings = stream.getAudioTracks()[0].getSettings();
        this._settings = {
            "sampleRate":settings.sampleRate,
            "bitsPerSample":settings.sampleSize,
            "channelCount": settings.channelCount,
        };
    }

    /**
     * Sends received data over websocket connection.
     *
     * @param {Blob} [chunk] Represent 100 ms worth of 16-bit audio samples
     *
     * @returns {void}
     */
     _onData = event => {
        if (this._rabbitMQ.connected) {
            const samplesFP32 = event.inputBuffer.getChannelData(0);
            var samples = new Int16Array(samplesFP32.length);
            samplesFP32.forEach(function(item, index, array) {
                samples[index] = item * 32768;
            });
            const chunk = {
                "samples": Buffer.from(samples.buffer).toString('binary'),
                ...this._settings
            }

            const data = {
                roomId: this._roomId,
                userId: this._userId,
                timestamp: new Date().toISOString(),
                chunk
            };
            const jsonData = JSON.stringify(data);
            this._rabbitMQ.publish({destination:'/exchange/asr', body:jsonData});
        }
    }

    /**
     * Sends disconnect message.
     *
     * @returns {void}
     */
     disconnect = () => {
        if (this._rabbitMQ.connected) {
            const data = {
                roomId: this._roomId,
                userId: this._userId,
                timestamp: new Date().toISOString(),
                chunk: {}
            };
            const jsonData = JSON.stringify(data);
            this._rabbitMQ.publish({destination:'/exchange/asr', body:jsonData});
        }
        //deactivate, to stop reconnecting
        this._rabbitMQ.deactivate();
    }
}

export default AudioCapturer;
