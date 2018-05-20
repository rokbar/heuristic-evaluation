import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {ConnectedRouter, routerMiddleware} from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';

import './index.css';
import 'semantic-ui-css/semantic.min.css';
import registerServiceWorker from './registerServiceWorker';
import reducers from './reducers';
import Routes from './routes';
import {INIT} from './actions/types';
import localStorageLoad from './middleware/localStorageLoad';

const history = createHistory();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// localStorageLoad - middleware to authenticate on app load (if token exists)
const enhancer = composeEnhancers(
  applyMiddleware(
    routerMiddleware(history),
    thunk,
    localStorageLoad,
  )
);
const store = createStore(reducers, enhancer);

// dispatch an initialization action before app renders
store.dispatch({type: INIT});

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Routes/>
    </ConnectedRouter>
  </Provider>
  , document.getElementById('root')
);
registerServiceWorker();
