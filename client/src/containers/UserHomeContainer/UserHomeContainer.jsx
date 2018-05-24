import React, { Component } from 'react';
import { Switch } from 'react-router-dom'

import { Segment } from 'semantic-ui-react';

import Layout from 'components/Layout';
import BreadcrumbRoute from 'components/Breadcrumbs/BreadcrumbRoute';
import SharedMenuContainer from 'containers/SharedMenuContainer';
import UserTeamTableContainer from './UserTeamsTableContainer';
import UserTeamContainer from './UserTeamContainer';
import EditAccountContainer from '../EditAccountContainer';

class UserHomeContainer extends Component {
  pushHistory(pathName) {
    this.props.history.push(pathName);
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
    return [
      <Switch key="UserHomeContainerRoutes">
        <BreadcrumbRoute
          exact
          title='Komandų sąrašas'
          path='/evaluator'
          render={() => this.renderArticleSegment(UserTeamTableContainer)}
        />
        <BreadcrumbRoute
          title='Komanda'
          path='/evaluator/teams/:teamId'
          render={(props) => this.renderArticleSegment(UserTeamContainer, props)}
        />
        <BreadcrumbRoute
          title='Redaguoti paskyrą'
          path='/evaluator/editAccount'
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

export default UserHomeContainer;
