import io from 'socket.io-client';
//import { frameProcessorWorker } from './worker';


class Capturer {
    constructor(room, roomId, userId, track) {
        this._socket = null;
        this._isLive = false;
        this._room = room;
        this._roomId = roomId;
        this._userId = userId;
        this._capturer = new ImageCapture(track);
        this._frameProcessor = new Worker('./worker.js', { type: 'module' });
        this._frameProcessor.addEventListener('message', this._pushNextFrame);
        this._frameProcessor.addEventListener('error', this._logFrameProcessorError);

        this._start = null;
        this._finish = null;
    }

    _pushNextFrame = (event) => {
        if (this._isLive) {
            const data = event.data;
            console.log(`Frame ${URL.createObjectURL(data)} for user ${this._userId}`);
            //this._socket.emit('next-frame', { room: this._room, roomId: this._roomId, userId: this._userId, image: data });
        }
    }

    _logFrameProcessorError = (err) => {
        console.log(err.message, err.file);
    }

    /**
     * Connects to socket and initializes capturing process
     * 
     * @returns {void}
     */
    connect = async (dispatcherUrl) => {
        // this._socket = io(dispatcherUrl);
        // this._socket.on('connect', () => {
        //     console.log(`Send server-ping ${this._userId}`);
        //     this._socket.emit('server-ping', this._userId);
        // });
        // this._socket.on('server-pong', () => {
        //     console.log(`Received server-pong ${this._userId}`)
        //     this._isLive = true;
        //     this._socket.emit('add', { room: this._room, roomId: this._roomId, userId: this._userId });
        //     this._grabNextFrame();
        // });
        this._isLive = true;
        this._grabNextFrame();
    }

    /**
     * Infinite loop of capturing next available frame in stream
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
     * Stops frames pushing and closes socket connection
     * 
     * @returns {void}
     */
    disconnect = () => {
        this._isLive = false;
        this._frameProcessor.terminate();
        // this._socket.emit('remove', {room: this._room, roomId: this._roomId, userId: this._userId});
        // this._socket.close();
    }
}

export default Capturer;
