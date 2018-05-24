import React, {Component} from 'react';
import { Switch } from 'react-router-dom';
import { Segment } from 'semantic-ui-react';

import BreadcrumbRoute from 'components/Breadcrumbs/BreadcrumbRoute';
import Layout from 'components/Layout';
import Tabs from 'components/Tabs';
import SharedMenuContainer from 'containers/SharedMenuContainer';
import UsersTableContainer from './UsersTableContainer';
import AddUserForm from './UsersTableContainer/AddUserForm';
import EditUserForm from './UsersTableContainer/EditUserForm';
import CompaniesTableContainer from './CompaniesTableContainer';
import AddCompanyForm from './CompaniesTableContainer/AddCompanyForm';
import EditAccountContainer from '../EditAccountContainer';

export default class SystemAdminHomeContainer extends Component {
  pushHistory(pathName) {
    this.props.history.push(pathName);
  };

  getTabs() {
    return [
      {name: 'Naudotojai', pathName: '/systemadmin/users'},
      {name: 'Įmonės', pathName: '/systemadmin/companies'},
    ]
  }

  renderArticleSegment(Component, props) {
    return (
      <Segment attached="bottom">
        <Component
          {...props}
          pushHistory={(pathName) => this.pushHistory(pathName)}
        />
      </Segment>
    )
  }

  renderArticleContent() {
    const { location } = this.props;
    return [
      <Tabs
        panes={this.getTabs()}
        currentLocation={location.pathname}
      />,
      <Switch>
        <BreadcrumbRoute
          exact
          title="Naudotojų sąrašas"
          path="/systemadmin/users"
          component={() => this.renderArticleSegment(UsersTableContainer)}
        />
        <BreadcrumbRoute
          title="Sukurti naudotoją"
          path="/systemadmin/users/add"
          component={() => this.renderArticleSegment(AddUserForm)}
        />
        <BreadcrumbRoute
          title="Redaguoti naudotoją"
          path="/systemadmin/users/edit/:userId"
          component={(props) => this.renderArticleSegment(EditUserForm, props)}
        />
        <BreadcrumbRoute
          exact
          title="Organizacijų sąrašas"
          path="/systemadmin/companies"
          component={() => this.renderArticleSegment(CompaniesTableContainer)}
        />
        <BreadcrumbRoute
          title="Sukurti organizaciją"
          path="/systemadmin/companies/add"
          component={() => this.renderArticleSegment(AddCompanyForm)}
        />
        <BreadcrumbRoute
          title="Redaguoti paskyrą"
          path='/systemadmin/editAccount'
          render={() => this.renderArticleSegment(EditAccountContainer)}
        />
      </Switch>,
    ]
  }

  render() {
    return (
      <Layout
        header={SharedMenuContainer}
        article={this.renderArticleContent()}
      />
    )
  }
}
