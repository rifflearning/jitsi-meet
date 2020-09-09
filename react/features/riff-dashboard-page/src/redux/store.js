/* ******************************************************************************
 * store.js                                                                     *
 * *************************************************************************/ /**
 *
 * @fileoverview Define the store for the redux state
 *
 * Created on       August 1, 2018
 * @author          Dan Calacci
 *
 * @copyright (c) 2018-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { routerMiddleware } from 'connected-react-router';
import { persistStore } from 'redux-persist';
import thunk from 'redux-thunk';

import { logger } from 'libs/utils';

import { browserHistory } from '../history';

import createRootReducer from './reducers';
import { addRiffListener } from './listeners/riff';


const composeEnhancers = composeWithDevTools({
    // Specify custom devTools options
});

// Apply the middleware to the store
const store = createStore(
    createRootReducer(browserHistory),
    composeEnhancers(
        applyMiddleware(thunk),
        applyMiddleware(routerMiddleware(browserHistory))
    ));

logger.debug('Start the RiffListener');
addRiffListener(store.dispatch, store.getState);

const persistor = persistStore(store);

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    store,
    persistor,
};

