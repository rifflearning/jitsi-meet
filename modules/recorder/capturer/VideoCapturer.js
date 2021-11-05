import io from 'socket.io-client';
import { FRAME } from './constants';


class Capturer {
    constructor(room, roomId, userId, stream) {
        this._socket = null;
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
     * @param {String} dispatcherUrl - The url that socket will use to connect
     * @returns {void}
     */
    connect = async (dispatcherUrl) => {
        this._socket = io(dispatcherUrl);
        this._socket.on('connect', () => {
            this._socket.emit('server-ping', this._userId);
        });
        this._socket.on('server-pong', () => {
            this._isLive = true;
            this._socket.emit('add', { 
                room: this._room, 
                roomId: this._roomId, 
                userId: this._userId 
            });
            this._pushNextFrame();
        });
    }

    /**
     * Infinite loop of capturing next available frame in stream
     * 
     * @returns {void}
     */
    _pushNextFrame = async () => {
        if (this._isLive) {
            try {
                const bitmap = await this._capturer.grabFrame();
                const blob = await this._processFrame(bitmap);
                
                this._socket.emit('next-frame', { 
                    room: this._room, 
                    roomId: this._roomId, 
                    userId: this._userId, 
                    image: blob 
                });
                this._pushNextFrame(); // schedule next one
            } catch (err) {
                console.error(err);
            }
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
            const { width, height } = this._rescaleToWidth(bitmap, FRAME.WIDTH);
 
            this._canvas.width = width;
            this._canvas.height = height;           
            context.drawImage(bitmap, 0, 0, width, height);
            this._canvas.toBlob(resolve, 'image/jpeg', 1);
        });
    }

    _rescaleToWidth = (bitmap, width) => {
        return {
            width: width,
            height: bitmap.height / (bitmap.width / width)
        };
    }

    /**
     * Stops frames pushing and closes all resources
     * 
     * @returns {void}
     */
    disconnect = () => {
        this._isLive = false;
        this._socket.emit('remove', { 
            room: this._room, 
            roomId: this._roomId, 
            userId: this._userId 
        });
        this._socket.close();
    }
}

export default Capturer;
