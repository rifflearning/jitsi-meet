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

// import 'webrtc-adapter'; // see https://bloggeek.me/webrtc-adapter-js/ for what this does.

// TODO: WHY? If this isn't here, video chat crashes when someone joins!
//       And yet as far as I can tell this package is only supposed to be used
//       for development. -mjl 2018-10-15
// import 'react-hot-loader';

// import 'sass/main.scss';

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { persistor, store } from 'Redux/store';
import { getRtcServerVer } from 'Redux/selectors/config';
import { logger } from 'libs/utils';

import { browserHistory } from './history';
import { Helmet } from 'react-helmet';

import { NavBar } from 'Components/NavBar';
import { Dashboard } from 'Components/Dashboard';
import { firebaseApp } from './libs/utils/firebase_utils';

logger.info(`Running riff-rtc server version ${getRtcServerVer()}\n\n`);

const DashboardPage = () => {
    useEffect(() => {
        const $style = document.createElement("style");
        document.head.appendChild($style);
        $style.innerHTML = `
            body, html {
                height: auto;
            }
            `;
        return () => {
            $style.parentNode.removeChild($style);
        }
    }, [])

    return <div id="riff-dashboard-page-full">
        <div id='main-content-container'>
            <Dashboard />
        </div>
    </div>
}

export default () => (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            {/* <ConnectedRouter history={browserHistory}> */}
              <DashboardPage />
            {/* </ConnectedRouter> */}
        </PersistGate>
    </Provider>
)

