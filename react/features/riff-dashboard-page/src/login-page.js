import React from 'react';
import ReactDOM from 'react-dom';

import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { persistor, store } from 'Redux/store';
import { browserHistory } from './history';

// import { LogIn } from './LogIn';
import { LogIn } from 'Components/LogIn';
import { NavBar } from 'Components/NavBar';
import { Helmet } from 'react-helmet';

const LoginPage = () => {
  return <div>
      <Helmet defaultTitle='Riff' titleTemplate='%s - Riff' />
      <div>
          <NavBar
            activeRoute={'/login'}
            isUserLoggedIn={false}
          />
          <div id='main-content-container'>
              <LogIn />
          </div>
      </div>
  </div>
}

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ConnectedRouter history={browserHistory}>
        <LoginPage />
      </ConnectedRouter>
    </PersistGate>
  </Provider>
  ,
  document.getElementById('root')
);
