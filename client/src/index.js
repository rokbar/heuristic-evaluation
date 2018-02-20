import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';

import './index.css';
import 'semantic-ui-css/semantic.min.css';
import registerServiceWorker from './registerServiceWorker';
import reducers from './reducers';
import Routes from './routes';
import { INIT } from './actions/types';
import localStorageLoad from './middleware/localStorageLoad';

const history = createHistory();
// localStorageLoad - middleware to authenticate on app load (if token exists)
const createStoreWithMiddleware = applyMiddleware(
  localStorageLoad,
  reduxThunk,
  routerMiddleware(history)
)(createStore);
const store = createStoreWithMiddleware(reducers);

// dispatch an initialization action before app renders
store.dispatch({ type: INIT });

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Routes />
    </ConnectedRouter>
  </Provider>
  , document.getElementById('root')
);
registerServiceWorker();
