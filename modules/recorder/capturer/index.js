import io from 'socket.io-client';
import Capturer from './Capturer';
import { getAllActiveVideoTracks } from './functions';


class Sockets {
    constructor(serverUrl) {
        this._serverUrl = serverUrl;
        this._sockets = new Map();
    }

    /**
     * Creates new socket for participant and sends 
     * message with participantId into this socket
     * 
     * @returns {void}
     */
    create = participantId => {
        if (!this._sockets.has(participantId)) {
            const socket = io(this._serverUrl);
            socket.on('connect', () => {
                socket.emit('add', participantId);
            });

            this._sockets.set(participantId, socket);
        }
    }

    /**
     * Sends message to the socket for participantId 
     * with frame if socket is open, otherwise just drops it
     * 
     * @returns {void}
     */
    send = (participantId, frame) => {
        const socket = this._sockets.get(participantId);
        if (socket.connected) {
            socket.emit('frame', {
                "participantId": participantId,
                "frame": frame
            });
        }
    }

    /**
     * Closes all socket connections
     * 
     * @returns {void}
     */
    close = () => {
        const sockets = this._sockets.values();
        for (let socket of sockets) {
            socket.close();
        }
    }

}

export default {

    /**
     * Holds a list of participants  
     */
    _participants: [],

    /**
     * Holds a map between participant and its video stream capturer
     */
    _capturers: new Map(),

    /**
     * Holds sockets for pushing participant's frames for analysis
     */
    _sockets: null,

    /**
     * Holds an interval for scheduling frame pulling 
     */
    _interval: null,

    /**
     * Holds delay value in ms beetwen frame pulling
     */
    _delay: 0,

    _init(serverUrl, fps) {
        this._sockets = new Sockets(serverUrl);

        getAllActiveVideoTracks().forEach(track => {
            const participantId = track.participantId;
            const stream = track.jitsiTrack.stream;

            this._participants.push(participantId);
            this._capturers.set(participantId, new Capturer(stream));
            this._sockets.create(participantId);
        });

        this._delay = Math.floor(1000 / (this._participants.length * fps));
    },

    start(serverUrl, fps) {
        this._init(serverUrl, fps);

        this._interval = setInterval(async () => {
            const participantId = this._participants.shift();
            // move participant back, so we can still capture his frames
            this._participants.push(participantId);

            const capturer = this._capturers.get(participantId);
            try {
                const frame = await capturer.captureFrame();
                this._sockets.send(participantId, frame);
            } catch (err) {
                console.error(err);
            }
        }, this._delay);
    },

    stop() {
        clearInterval(this._interval);
        this._sockets.close();
    }

};
