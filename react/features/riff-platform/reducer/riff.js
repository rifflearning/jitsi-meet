import * as actionTypes from '../constants/actionTypes';

export default (state = {}, action) => {
    switch (action.type) {
    case actionTypes.SET_RIFF_SERVER_ROOM_ID:
        return { roomId: action.roomId };
    default:
        return state;
    }
};
