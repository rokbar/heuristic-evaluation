import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'
import { Segment, Transition } from 'semantic-ui-react';

import Layout from 'components/Layout';
import SharedMenuContainer from 'containers/SharedMenuContainer';
import FilterContainer from 'containers/FilterContainer';
import UserTeamTableContainer from './UserTeamsTableContainer';
import UserTeamContainer from './UserTeamContainer';
import EditAccountContainer from '../EditAccountContainer';

class UserHomeContainer extends Component {
  pushHistory(pathName) {
    this.props.history.push(pathName);
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
    return [
      <Switch>
        <Route
          exact
          path='/evaluator'
          render={() => this.renderArticleSegment(UserTeamTableContainer)}
        />
        <Route
          path='/evaluator/teams/:teamId'
          render={(props) => this.renderArticleSegment(UserTeamContainer, props)}
        />
        <Route
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
        aside={this.renderAsideContent()}
      />
    )
  }
}

export default UserHomeContainer;
