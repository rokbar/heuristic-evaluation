import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Loadable from 'react-loadable';
import LoadingComponent from './components/LoadingComponent';
import SignInContainer from './containers/SignInContainer';
import AuthorizationHOC from './components/AuthorizationHOC';
import SystemAdminHomeContainer from './containers/SystemAdminHomeContainer';
import CompanyAdminHomeContainer from './containers/CompanyAdminHomeContainer';
import UserHomeContainer from './containers/UserHomeContainer';

const UserRoutes = AuthorizationHOC(['user', 'leader']);
const LeaderRoutes = AuthorizationHOC(['leader']);
const TeamAdminRoutes = AuthorizationHOC(['leader', 'companyadmin'])
const CompanyAdminRoutes = AuthorizationHOC(['companyadmin']);
const SystemAdminRoutes = AuthorizationHOC(['systemadmin']);

// const AsyncApp = asyncComponent(() => import('./App'));
// const AsyncHome = Loadable({
//   loader: () => import('./App'),
//   loading: LoadingComponent,
// });

export default ({childProps}) =>
  <Switch>
    <Route path="/" exact component={SignInContainer} props={childProps} />
    <Route path="/systemadmin" component={SystemAdminRoutes(SystemAdminHomeContainer)} props={childProps} />
    <Route path="/systemadmin/addUser" component={SystemAdminRoutes(SystemAdminHomeContainer)} props={childProps} />
    <Route path="/companyadmin" component={CompanyAdminRoutes(CompanyAdminHomeContainer)} props={childProps} />
    <Route path="/user" component={UserRoutes(UserHomeContainer)} props={childProps} />
  </Switch>