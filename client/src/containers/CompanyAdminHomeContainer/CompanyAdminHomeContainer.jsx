import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch } from 'react-router-dom';
import { Segment } from 'semantic-ui-react';

import BreadcrumbRoute from 'components/Breadcrumbs/BreadcrumbRoute';
import Layout from 'components/Layout';
import Tabs from 'components/Tabs';
import SharedMenuContainer from 'containers/SharedMenuContainer';
import TeamsTableContainer from './TeamsTableContainer';
import AddTeamForm from './TeamsTableContainer/AddTeamForm';
import EditTeamTab from './TeamsTableContainer/EditTeamTab';
import EditAccountContainer from '../EditAccountContainer';

import { getTeamStates } from 'actions/teamStates';

class CompanyAdminHomeContainer extends Component {
  componentDidMount() {
    this.props.getTeamStates();
  }

  pushHistory(pathName) {
    this.props.history.push(pathName);
  };

  getTabs() {
    return [
      {name: 'Komandos', pathName: '/companyadmin/teams'},
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
          title="Organizacijos komandų sąrašas"
          path="/companyadmin/teams"
          component={() => this.renderArticleSegment(TeamsTableContainer)}
        />
        <BreadcrumbRoute
          title="Sukurti komandą"
          path="/companyadmin/teams/add"
          component={() => this.renderArticleSegment(AddTeamForm)}
        />
        <BreadcrumbRoute
          title="Redaguoti komandą"
          path="/companyadmin/teams/edit/:teamId"
          component={(props) => this.renderArticleSegment(EditTeamTab, props)}
        />
        <BreadcrumbRoute
          title="Redaguoti paskyrą"
          path="/companyadmin/editAccount"
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

export default connect(
  (state) => ({ teamStates: state.teamStates }),
  { getTeamStates },
)(CompanyAdminHomeContainer);
