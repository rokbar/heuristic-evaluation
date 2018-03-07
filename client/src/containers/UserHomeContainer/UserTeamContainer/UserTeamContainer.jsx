import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { Segment } from 'semantic-ui-react';

import Tabs from 'components/Tabs';
import UserTeamInfoTab from './UserTeamInfoTab';
import UserProblemsTableTab from './UserProblemsTableTab';
import UserTeamHeuristicsTab from './UserTeamHeuristicsTab';
import UserTeamPlanTab from './UserTeamPlanTab';
import UserTeamEvaluatorsListTab from './UserTeamEvaluatorsListTab';

import { getTeamStates } from 'actions/teamStates';

class UserTeamContainer extends Component {
  componentDidMount() {
    this.props.getTeamStates();
  }

  pushHistory(pathName) {
    this.props.history.push(pathName);
  };

  getTabs() {
    const { teamId } = this.props.match.params;
    return [
      {name: 'Informacija', pathName: `/evaluator/teams/${teamId}/info`},
      {name: 'Vertinimas', pathName: `/evaluator/teams/${teamId}/evaluation`},
      {name: 'Problemos', pathName: `/evaluator/teams/${teamId}/problems`},
      {name: 'Euristikos', pathName: `/evaluator/teams/${teamId}/heuristics`},
      {name: 'Planas', pathName: `/evaluator/teams/${teamId}/plan`},
      {name: 'Vertintojai', pathName: `/evaluator/teams/${teamId}/evaluators`},
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

  render() {
    const { location } = this.props;
    return [
      <Tabs
        panes={this.getTabs()}
        currentLocation={location.pathname}
      />,
      <Switch>
        <Route
          path='/evaluator/teams/:teamId/info'
          component={(props) => this.renderArticleSegment(UserTeamInfoTab, props)}
        />
        <Route
          path='/evaluator/teams/:teamId/evaluation'
          component={(props) => this.renderArticleSegment(UserTeamEvaluationTab, props)}
        />
        <Route
          path='/evaluator/teams/:teamId/problems'
          component={() => this.renderArticleSegment(UserProblemsTableTab)}
        />
        <Route
          path='/evaluator/teams/:teamId/heuristics'
          component={() => this.renderArticleSegment(UserTeamHeuristicsTab)}
        />
        <Route
          path='/evaluator/teams/:teamId/plan'
          component={(props) => this.renderArticleSegment(UserTeamPlanTab)}
        />
        <Route
          path='/evaluator/teams/:teamId/evaluators'
          component={() => this.renderArticleSegment(UserTeamEvaluatorsListTab)}
        />
      </Switch>,
    ]
  }
}

export default connect(
  (state) => ({ teamStates: state.teamStates }),
  { getTeamStates },
)(UserTeamContainer);
