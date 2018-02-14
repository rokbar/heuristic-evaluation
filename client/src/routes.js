import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Loadable from 'react-loadable';
import LoadingComponent from './components/LoadingComponent';
import SignInContainer from './containers/SignInContainer';

// const AsyncApp = asyncComponent(() => import('./App'));
// const AsyncHome = Loadable({
//   loader: () => import('./App'),
//   loading: LoadingComponent,
// });

export default ({childProps}) =>
  <Switch>
    <Route
      path="/"
      exact
      component={SignInContainer}
      props={childProps}
    />
  </Switch>