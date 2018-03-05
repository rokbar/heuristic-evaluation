import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { Segment } from 'semantic-ui-react';

import Layout from 'components/Layout';
import Tabs from 'components/Tabs';
import SharedMenuContainer from 'containers/SharedMenuContainer';
import UserTeamsTableContainer from './UserTeamsTableContainer';
import UserTeamInfoTab from './UserTeamsTableContainer/UserTeamInfoTab';
import { getTeamStates } from 'actions/teamStates';

class UserHomeContainer extends Component {
  componentDidMount() {
    this.props.getTeamStates();
  }

  pushHistory(pathName) {
    this.props.history.push(pathName);
  };

  getTabs() {
    return [
      {name: 'Komandos', pathName: '/evaluator/teams'},
    ]
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
    const { location } = this.props;
    return [
      <Tabs
        panes={this.getTabs()}
        currentLocation={location.pathname}
      />,
      <Switch>
        <Route
          exact
          path='/evaluator/teams'
          component={() => this.renderArticleSegment(UserTeamsTableContainer)}
        />
        <Route
          path='/evaluator/teams/:teamId'
          component={(props) => this.renderArticleSegment(UserTeamInfoTab, props)}
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

export default connect(
  (state) => ({ teamStates: state.teamStates }),
  { getTeamStates },
)(UserHomeContainer);
