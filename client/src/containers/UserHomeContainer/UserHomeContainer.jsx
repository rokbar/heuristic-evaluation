import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'
import { Segment } from 'semantic-ui-react';

import Layout from 'components/Layout';
import SharedMenuContainer from 'containers/SharedMenuContainer';
import UserTeamTableContainer from './UserTeamsTableContainer';
import UserTeamContainer from './UserTeamContainer';

class UserHomeContainer extends Component {
  pushHistory(pathName) {
    this.props.history.push(pathName);
  }

  renderAsideContent() {
    return (
      <div>Not Implemented</div>
    )
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
