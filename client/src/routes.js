import React from 'react';
import {Switch} from 'react-router-dom';
import Loadable from 'react-loadable';

import APIResponseModal from 'components/APIResponseModal';
import BreadcrumbRoute from 'components/Breadcrumbs/BreadcrumbRoute';
import LoadingComponent from './components/LoadingComponent';
import SignInContainer from './containers/SignInContainer';
import AuthorizationHOC from './components/AuthorizationHOC';
import SystemAdminHomeContainer from './containers/SystemAdminHomeContainer';
import CompanyAdminHomeContainer from './containers/CompanyAdminHomeContainer';
import UserHomeContainer from './containers/UserHomeContainer';

const UserRoutes = AuthorizationHOC(['evaluator', 'leader']);
const LeaderRoutes = AuthorizationHOC(['leader']);
const TeamAdminRoutes = AuthorizationHOC(['leader', 'companyadmin'])
const CompanyAdminRoutes = AuthorizationHOC(['companyadmin']);
const SystemAdminRoutes = AuthorizationHOC(['systemadmin']);

// const AsyncApp = asyncComponent(() => import('./App'));
// const AsyncHome = Loadable({
//   loader: () => import('./App'),
//   loading: LoadingComponent,
// });

const SystemAdminHome = SystemAdminRoutes(SystemAdminHomeContainer);
const CompanyAdminHome = CompanyAdminRoutes(CompanyAdminHomeContainer);
const EvaluatorHome = UserRoutes(UserHomeContainer);

export default ({childProps}) => [
  <APIResponseModal/>,
  <Switch>
    <BreadcrumbRoute title="Pradinis" path="/" exact component={SignInContainer} props={childProps} />
    <BreadcrumbRoute title="Sistemos administratoriaus pradinis" path="/systemadmin" component={SystemAdminHome} props={childProps} />
    <BreadcrumbRoute title="Įmonės administratoriaus pradinis" path="/companyadmin" component={CompanyAdminHome} props={childProps} />
    <BreadcrumbRoute title="Vertintojo pradinis" path="/evaluator" component={EvaluatorHome} props={childProps} />
  </Switch>,
]