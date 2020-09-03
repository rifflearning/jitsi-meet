/* ******************************************************************************
 * ActionTypes.js                                                               *
 * *************************************************************************/ /**
 *
 * @fileoverview Types of actions that are used in Redux
 *
 * [More detail about the file's contents]
 *
 * Created on       August 13, 2018
 * @author          Dan Calacci
 *
 * @copyright (c) 2018-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

// action types
export const OPEN_NAV_MENU = 'OPEN_NAV_MENU';
export const CLOSE_NAV_MENU = 'CLOSE_NAV_MENU';

export const CHAT_SHARE_STREAM = 'CHAT::SHARE_STREAM';
export const CHAT_DISPLAY_NAME_CHANGE = 'CHAT::DISPLAY_NAME_CHANGE';
export const CHAT_GET_MEDIA_ERROR = 'CHAT::GET_MEDIA_ERROR';
export const CHAT_GET_DISPLAY_ERROR = 'CHAT::GET_DISPLAY_ERROR';
export const CHAT_START_WEBRTC = 'CHAT::START_WEBRTC';
export const CHAT_SET_WEBRTC_CONFIG = 'CHAT::SET_WEBRTC_CONFIG';
export const CHAT_READY_TO_CALL = 'CHAT::READY_TO_CALL';
export const CHAT_LEAVE_ROOM = 'CHAT::LEAVE_ROOM';
export const CHAT_CHANGE_ROOM_NAME = 'CHAT::CHANGE_ROOM_NAME';
export const CHAT_CHANGE_ROOM_ID = 'CHAT::CHANGE_ROOM_ID';
export const CHAT_CHANGE_DISPLAY_NAME = 'CHAT::CHANGE_DISPLAY_NAME';
export const CHAT_VOLUME_CHANGED = 'CHAT::VOLUME_CHANGED';
export const CHAT_WEBRTC_ID_CHANGE = 'CHAT::WEBRTC_ID_CHANGE';
export const CHAT_SHOW_MEETING_DOC = 'CHAT::SHOW_MEETING_DOC';
export const CHAT_URL_SHARE_START = 'CHAT::URL_SHARE_START';
export const CHAT_URL_SHARE_STOP = 'CHAT::URL_SHARE_STOP';
export const JOIN_ROOM = 'CHAT::JOIN_ROOM';
export const JOINED_ROOM = 'CHAT::JOINED_ROOM';
export const IN_ROOM = 'CHAT::IN_ROOM';
export const SHARE_SCREEN = 'CHAT::SHARE_SCREEN';
export const STOP_SHARE_SCREEN = 'CHAT::STOP_SHARE_SCREEN';
export const ADD_SHARED_SCREEN = 'CHAT::ADD_SHARED_SCREEN';
export const REMOVE_SHARED_SCREEN = 'CHAT::REMOVE_SHARED_SCREEN';
export const MUTE_AUDIO = 'CHAT::MUTE_AUDIO';
export const UNMUTE_AUDIO = 'CHAT::UNMUTE_AUDIO';
export const MUTE_VIDEO = 'CHAT::MUTE_VIDEO';
export const ADD_PEER = 'CHAT::ADD_PEER';
export const REMOVE_PEER = 'CHAT::REMOVE_PEER';

export const RIFF_AUTHENTICATE_SUCCESS = 'RIFF::AUTHENTICATE_SUCCESS';
export const RIFF_AUTHENTICATE_FAIL = 'RIFF::AUTHENTICATE_FAIL';
export const RIFF_IS_MEETING_STARTED_UPDATE = 'RIFF::IS_MEETING_STARTED_UPDATE';
export const RIFF_PARTICIPANTS_CHANGED = 'RIFF:PARTICIPANTS_CHANGED';
export const RIFF_TURN_UPDATE = 'RIFF:TURN_UPDATE';
export const RIFF_MEETING_ID_UPDATE = 'RIFF:MEETING_ID_UPDATE';

export const TEXT_CHAT_MSG_UPDATE = 'TEXTCHAT::UPDATE_MESSAGE';
export const TEXT_CHAT_SET_BADGE = 'TEXTCHAT::SET_BADGE';
