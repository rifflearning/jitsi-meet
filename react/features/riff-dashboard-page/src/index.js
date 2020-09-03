/* ******************************************************************************
 * index.jsx                                                                    *
 * *************************************************************************/ /**
 *
 * @fileoverview Setup/initialization of the Riff react SPA
 *
 * Created on       August 7, 2017
 * @author          Jordan Reedie
 * @author          Dan Calacci
 *
 * @copyright (c) 2017 Riff Learning,
 *            See LICENSE.txt for license information.
 *
 * ******************************************************************************/

import 'webrtc-adapter'; // see https://bloggeek.me/webrtc-adapter-js/ for what this does.

// TODO: WHY? If this isn't here, video chat crashes when someone joins!
//       And yet as far as I can tell this package is only supposed to be used
//       for development. -mjl 2018-10-15
import 'react-hot-loader';

import 'sass/main.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { App } from 'components/App';
import { persistor, store } from 'redux/store';
import { getRtcServerVer } from 'redux/selectors/config';
import { logger } from 'libs/utils';

import { browserHistory } from './history';

logger.info(`Running riff-rtc server version ${getRtcServerVer()}\n\n`);

ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <ConnectedRouter history={browserHistory}>
                <App/>
            </ConnectedRouter>
        </PersistGate>
    </Provider>,
    document.getElementById('root')
);
