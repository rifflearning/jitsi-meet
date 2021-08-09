/* ******************************************************************************
 * index.js                                                                     *
 * *************************************************************************/ /**
 *
 * @fileoverview Provides the top level redux reducer for the app's state
 *
 * Created on       August 1, 2018
 * @author          Dan Calacci
 * @author          Michael Jay Lippert
 * @author          Brec Hanson
 *
 * @copyright (c) 2018-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web and AsyncStorage for react-native
import { connectRouter } from 'connected-react-router';
import { persistReducer } from 'redux-persist';

import { chat } from './chat';
import { dashboard } from './dashboard';
import { menu } from './menu';
import { riff } from './riff';
import { user } from './user';


const rootPersistConfig = {
    key: 'root',
    storage,
    blacklist: [ 'chat', 'dashboard', 'lti', 'menu', 'riff', 'router', 'user' ]
};

// we want our webRTC peers to be populated by our server,
// not saved state.
// however the room name and display name may be associated w/ the logged in user
// therefore like the user they should be persisted.
const chatPersistConfig = {
    key: 'chat',
    storage: storage,
    whitelist: [
        'displayName',
        'isDisplayNameUserSettable',
        'isRoomNameUserSettable',
        'roomName',
        'testchat',
    ],
};

/** We want a logged in user to stay logged in until they explicitly log out
 *  (That may change, but it's how we want it to work today)
 */
const userPersistConfig = {
    key: 'user',
    storage: storage,
    blacklist: [
    ],
};

// default export is createRootReducer()
export default history => persistReducer(
    rootPersistConfig,
    combineReducers({
        chat: persistReducer(chatPersistConfig, chat),
        dashboard: dashboard,
        menu: menu,
        riff: riff,
        router: connectRouter(history),
        user: persistReducer(userPersistConfig, user),
    }));
