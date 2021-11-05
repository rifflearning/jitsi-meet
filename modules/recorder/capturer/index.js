import AudioCapturer from './AudioCapturer';
import VideoCapturer from './VideoCapturer';
import { MEDIA_TYPES, MEDIA_TYPE } from './constants';
import { 
    getUserIdByParticipantId, 
    getStreamByParticipantId, 
    selectUpdatedParticipants,
    getRoomId,
    getRoom 
} from './functions';


class Capturers {
    constructor() {
        // map between participant and audio/video stream capturer
        this._capturers = {};
        for (let mediaType of MEDIA_TYPES) {
            this._capturers[mediaType] = new Map();
        }

        // link to dispatcher resource for analysis processes creation
        this._dispatcherUrl = null;

        // subscription cancellation function from store updates
        this.cancelStoreSubscription = null;
    }

    start = (dispatcherUrl) => {
        this._dispatcherUrl = dispatcherUrl;
        // init call to avoid waiting for first update in store
        this._handleParticipantsUpdate();

        this.cancelStoreSubscription = APP.store.subscribe(this._handleParticipantsUpdate);
    }

    _handleParticipantsUpdate = () => {
        for (let mediaType of MEDIA_TYPES) {
            this._handleParticipantsUpdateByMediaType(mediaType);
        }
    }

    _handleParticipantsUpdateByMediaType = (mediaType) => {
        if (!getRoomId()) {
            // we might need to wait for store to be updated with roomId
            return;
        }

        const update = selectUpdatedParticipants(Array.from(this._capturers[mediaType].keys()), mediaType);

        for (let participantId of update.left) {
            this._capturers[mediaType].get(participantId).disconnect();
            this._capturers[mediaType].delete(participantId);
        }

        for (let participantId of update.joined) {
            const stream = getStreamByParticipantId(participantId, mediaType);
            const userId = getUserIdByParticipantId(participantId, mediaType);
            const room = getRoom();
            const roomId = getRoomId();
            var capturer;
            if (mediaType == MEDIA_TYPE.AUDIO){
                capturer = new AudioCapturer(room, roomId, userId, stream);
            }
            else if (mediaType == MEDIA_TYPE.VIDEO){
                capturer = new VideoCapturer(room, roomId, userId, stream);
            }
            
            this._capturers[mediaType].set(participantId, capturer);
            capturer.connect(this._dispatcherUrl);
        }
    }

    stop = () => {
        this.cancelStoreSubscription();

        for (let mediaType of MEDIA_TYPES) {
            for (let capturer of this._capturers[mediaType].values()) {
                capturer.disconnect();
            }
            this._capturers[mediaType].clear();
        }
    }

}

export default new Capturers();
