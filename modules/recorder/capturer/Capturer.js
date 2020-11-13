import io from 'socket.io-client';


class Capturer {
    constructor(userId, stream) {
        this._socket = null;
        this._isLive = false;
        this._userId = userId;
        this._capturer = new ImageCapture(stream.getVideoTracks()[0]);
        // log user's frame data to be visible inside jibri
        this._capturer.getPhotoCapabilities().then(capabilities => {
            console.log(`Photo capabilities for ${this._userId}: `);
            console.log(capabilities);
        });
    }

    /**
     * Connects to socket and initializes capturing process
     * 
     * @returns {void}
     */
    connect = async (dispatcherUrl) => {
        let capabilities = await this._capturer.getPhotoCapabilities();
        this._socket = io(dispatcherUrl);
        this._socket.on('connect', () => {
            console.log(`Send server-ping ${this._userId}`);
            this._socket.emit('server-ping', this._userId);
        });
        this._socket.on('server-pong', data => {
            console.log(`Received server-pong ${this._userId}`)
            this._isLive = true;
            this._socket.emit('add', this._userId);
            this._pushNextFrame();
        });

        // let response = await fetch(`${dispatcherUrl}/emotion/${this._userId}`,
        //     {
        //         headers: {
        //             'Content-Type': 'application/json'
        //           },
        //         body: JSON.stringify(capabilities), 
        //         method:'post'
        //     }
        // );
        // if (response.ok) { 
        //     let json = await response.json();
        //     this._socket = io(`https://${json.data.ip}:${json.data.port}`);

        //     this._socket.on('connect', () => {
        //         this._isLive = true;
        //         this._socket.emit('add', this._userId);
        //         this._pushNextFrame();
        //     });
        // } 
        // else {
        //     console.error(`Cannot establish connection with server: ${dispatcherUrl}`);
        // }
    }

    /**
     * Infinite loop of capturing next available frame in stream
     * 
     * @returns {void}
     */
    _pushNextFrame = async () => {
        if (this._isLive) {
            try {
                const blob = await this._capturer.takePhoto();
                this._socket.emit('next-frame', {id: this._userId, image: blob});
                this._pushNextFrame(); // schedule next one
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
        this._socket.emit('remove', this._userId);
        this._isLive = false;
        this._socket.close();
    }
}

export default Capturer;
