import { FRAME } from './constants';


class Capturer {
    constructor(stream) {
        this._video = document.createElement('video');
        this._canvas = document.createElement('canvas');

        // Indicates whether or not streaming is on and 
        // we can capture frames from it
        this._streaming = false;

        // Width of frame, will be set to the default value
        this._frameWidth = null;

        // Height of frame, will be calculated based on the aspect ratio
        // of the input stream
        this._frameHeight = null;

        this._video.srcObject = stream;
        this._video.addEventListener('canplay', (e) => {
            this._streaming = true;
            this._frameWidth = FRAME.WIDTH;
            this._frameHeight = this._video.videoHeight / (this._video.videoWidth / FRAME.WIDTH);
        }, false);
        
        this._video.play();
    }

    /**
     * Captures a frame of the video stream by drawing it into an offscreen canvas
     * 
     * @returns {Promise}
     */
    captureFrame = () => {
        return new Promise((resolve, reject) => {
            if (this._streaming) {
                const context = this._canvas.getContext('2d');
                this._canvas.width = this._frameWidth;
                this._canvas.height = this._frameHeight;
            
                context.drawImage(this._video, 0, 0, this._frameWidth, this._frameHeight);

                this._canvas.toBlob(resolve, 'image/png', 1);
            } else {
                reject('video stream is not ready for capturing yet');
            }
        });
    }

}

export default Capturer;
