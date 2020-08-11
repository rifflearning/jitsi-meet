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

import { routerMiddleware } from 'connected-react-router';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore } from 'redux-persist';
import thunk from 'redux-thunk';

import { browserHistory } from '../history';
import { logger } from '../libraries/utils';


import { addRiffListener } from './listeners/riff';
import createRootReducer from './reducers';


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
    persistor
};

