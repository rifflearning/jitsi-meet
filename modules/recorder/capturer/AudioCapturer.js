import { Client } from '@stomp/stompjs';


class AudioCapturer {
    constructor(room, roomId, userId, stream) {
        this._mediaType = "webm";
        this._rabbitMQ = null;
        this._room = room;
        this._roomId = roomId;
        this._userId = userId;
        this._getAudioTracksProperties(stream);
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
        this._capturer.ondataavailable = this._onData;
        //Activate audio stream and stomp connection
        this._rabbitMQ.activate();

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
     _onData = async event => {
        if (this._rabbitMQ.connected) {
            const buffer = await event.data.arrayBuffer();
            const chunk = {
                "buffer": Buffer.from(buffer).toString('binary'),
                "type": this._mediaType
            }

            const data = {
                roomId: this._roomId,
                userId: this._userId,
                timestamp: new Date(event.timecode).toISOString(),
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
