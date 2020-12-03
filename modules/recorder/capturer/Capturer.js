import io from 'socket.io-client';


class Capturer {
    constructor(room, roomId, userId, track) {
        this._socket = null;
        this._isLive = false;
        this._room = room;
        this._roomId = roomId;
        this._userId = userId;
        this._capturer = new ImageCapture(track);

        // creates worker for imageBitmap processing in a separate thread
        this._frameProcessor = new Worker('../workers/frameProcessor.js', { type: 'module' });
        this._frameProcessor.addEventListener('message', this._pushNextFrame);
        this._frameProcessor.addEventListener('error', err => console.error(err.message, err.file));
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
            this._grabNextFrame();
        });
    }

    /**
     * Infinite loop of capturing next available frame from the stream
     * 
     * @returns {void}
     */
    _grabNextFrame = async () => {
        if (this._isLive) {
            try {
                const bitmap = await this._capturer.grabFrame();
                this._frameProcessor.postMessage({ bitmap }, [bitmap]);
                this._grabNextFrame(); // schedule next one
            } catch (err) {
                console.error(err);
            }
        }
    }

    /**
     * Pushes processed frame through the socket connection
     * 
     * @param {MessageEvent} event - Holds message's data passed from worker thread
     * @returns {void}
     */
    _pushNextFrame = (event) => {
        if (this._isLive) {
            this._socket.emit('next-frame', { 
                room: this._room, 
                roomId: this._roomId, 
                userId: this._userId, 
                image: event.data 
            });
        }
    }

    /**
     * Stops frames pushing and closes all resources
     * 
     * @returns {void}
     */
    disconnect = () => {
        this._isLive = false;
        this._frameProcessor.terminate();
        this._socket.emit('remove', { 
            room: this._room, 
            roomId: this._roomId, 
            userId: this._userId 
        });
        this._socket.close();
    }
}

export default Capturer;
