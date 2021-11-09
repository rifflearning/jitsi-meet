import { Client } from '@stomp/stompjs';
import { FRAME } from './constants';


class VideoCapturer {
    constructor(room, roomId, userId, stream) {
        this._isLive = false;
        this._room = room;
        this._roomId = roomId;
        this._userId = userId;
        this._capturer = new ImageCapture(stream.getVideoTracks()[0]);

        // used for bitmap processing
        this._canvas = document.createElement('canvas');
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
        this._isLive = true;
        this._pushNextFrame();
    }

    /**
     * Infinite loop of capturing next available frame in stream
     * 
     * @returns {void}
     */
    _pushNextFrame = async () => {
        if (this._isLive) {
            const bitmap = await this._capturer.grabFrame();
            const blob = await this._processFrame(bitmap);
            const buffer = await blob.arrayBuffer();
            
            const data = { 
                room: this._room,
                roomId: this._roomId,
                userId: this._userId,
                frame: Buffer.from(buffer).toString('binary') 
            };
            const jsonData = JSON.stringify(data);
            if (this._rabbitMQ.connected) {
                this._rabbitMQ.publish({destination:'/exchange/es', body:jsonData});
            }
            this._pushNextFrame(); // schedule next one
        }
    }

    /**
     * Converts {ImageBitmap} to JPEG by drawing it into canvas
     * 
     * @returns {Promise}
     */
    _processFrame = (bitmap) => {
        return new Promise(resolve => {
            const context = this._canvas.getContext('2d');
            const { width, height } = this._rescaleToWidth(bitmap, FRAME.HEIGHT);
 
            this._canvas.width = width;
            this._canvas.height = height;           
            context.drawImage(bitmap, 0, 0, width, height);
            this._canvas.toBlob(resolve, 'image/webp', 1);
        });
    }

    _rescaleToWidth = (bitmap, height) => {
        return {
            width: bitmap.width / (bitmap.height / height),
            height: height
        };
    }

    /**
     * Stops frames pushing and closes all resources
     * 
     * @returns {void}
     */
    disconnect = () => {
        this._isLive = false;
        if (this._rabbitMQ.connected) {
            const data = {
                roomId: this._roomId,
                userId: this._userId,
                timestamp: new Date().toISOString(),
                frame: ""
            };
            const jsonData = JSON.stringify(data);
            this._rabbitMQ.publish({destination:'/exchange/es', body:jsonData});
        }
        //deactivate, to stop reconnecting
        this._rabbitMQ.deactivate();
    }
}

export default VideoCapturer;
