import React, {Component} from 'react';
import { Switch, Route } from 'react-router-dom';
import { Segment } from 'semantic-ui-react';

import Layout from 'components/Layout';
import Tabs from 'components/Tabs';
import SharedMenuContainer from 'containers/SharedMenuContainer';
import FilterContainer from 'containers/FilterContainer';
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

  renderAsideContent() {
    return <FilterContainer
    />;
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
        <Route
          exact
          path='/systemadmin/users'
          component={() => this.renderArticleSegment(UsersTableContainer)}
        />
        <Route
          path='/systemadmin/users/add'
          component={() => this.renderArticleSegment(AddUserForm)}
        />
        <Route
          path='/systemadmin/users/edit/:userId'
          component={(props) => this.renderArticleSegment(EditUserForm, props)}
        />
        <Route
          exact
          path='/systemadmin/companies'
          component={() => this.renderArticleSegment(CompaniesTableContainer)}
        />
        <Route
          path='/systemadmin/companies/add'
          component={() => this.renderArticleSegment(AddCompanyForm)}
        />
        <Route
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
        aside={this.renderAsideContent()}
      />
    )
  }
}
