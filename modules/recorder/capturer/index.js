import Capturer from './Capturer';
import { 
    getUserIdByParticipantId, 
    getVideoStreamByParticipantId, 
    selectUpdatedParticipants,
    getRoomId,
    getRoom 
} from './functions';


class Capturers {
    constructor() {
        // map between participant and video stream capturer
        this._capturers = new Map();

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
        if (!getRoomId()) {
            // we might need to wait for store to be updated with roomId
            return;
        }

        const update = selectUpdatedParticipants(Array.from(this._capturers.keys()));

        for (let participantId of update.left) {
            this._capturers.get(participantId).disconnect();
            this._capturers.delete(participantId);
        }

        for (let participantId of update.joined) {
            const stream = getVideoStreamByParticipantId(participantId);
            const userId = getUserIdByParticipantId(participantId);
            const room = getRoom();
            const roomId = getRoomId();
            const capturer = new Capturer(room, roomId, userId, stream);
            
            this._capturers.set(participantId, capturer);
            capturer.connect(this._dispatcherUrl);
        }
    }

    stop = () => {
        this.cancelStoreSubscription();

        for (let capturer of this._capturers.values()) {
            capturer.disconnect();
        }
        this._capturers.clear();
    }

}

export default new Capturers();
