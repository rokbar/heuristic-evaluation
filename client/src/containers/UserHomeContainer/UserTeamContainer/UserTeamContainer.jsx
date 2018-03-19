import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';

import { Segment } from 'semantic-ui-react';
import AuthorizationTeamHOC from 'components/AuthorizationTeamHOC';
import Tabs from 'components/Tabs';
import UserTeamInfoTab from './UserTeamInfoTab';
import UserTeamEvaluationTab from './UserTeamEvaluationTab';
import UserProblemsTableTab from './UserProblemsTableTab';
import UserTeamHeuristicsTab from './UserTeamHeuristicsTab';
import UserTeamPlanTab from './UserTeamPlanTab';
import UserTeamEvaluatorsListTab from './UserTeamEvaluatorsListTab';

import { evaluatorTeamState } from 'utils/enums';

import { getTeamStates } from 'actions/teamStates';
import { getTeamById } from 'actions/teams';
import { getUserTeamState, startUserEvaluation } from 'actions/evaluatorTeam';

const TeamLeaderRoutes = AuthorizationTeamHOC(['leader']);
const EvaluatorRoutes = AuthorizationTeamHOC(['leader', 'evaluator']);

const initialState = {
  team: {
    systemName: '',
    systemUrl: '',
    systemContacts: '',
    state: '',
    leaderId: null,
    heuristicId: null,
  },
  evaluatorTeam: {
    id: null,
    state: evaluatorTeamState.new,
  },
  role: null,
};

class UserTeamContainer extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    const { teamId } = this.props.match.params;
    this.props.getTeamStates();
    this.getAndSetTeamState(teamId);
  }

  pushHistory(pathName) {
    this.props.history.push(pathName);
  };

  onUserEvaluationStart() {
    startUserEvaluation({ id: this.state.evaluatorTeam.id })
      .then(userTeamState => {
        return userTeamState.state && this.setState({
          evaluatorTeam: {
            id: userTeamState.id,
            state: userTeamState.state
          }
        });
      })
      .catch();
  }

  getAndSetTeamState(teamId) {
    let evaluatorState;
    getUserTeamState({ userId: this.props.auth.userId, teamId })
      .then(userTeamState => {
        evaluatorState = userTeamState[0];
        return this.props.getTeamById({ teamId });
      })
      .then(team => {
        const { systemName, systemUrl, systemContacts, state, leaderId, heuristicId } = team;
        return this.setState({
          team: {
            systemName,
            systemUrl,
            systemContacts,
            state,
            leaderId,
            heuristicId,
          },
          evaluatorTeam: {
            id: evaluatorState.id,
            state: evaluatorState.state,
          },
          role: this.getRole(leaderId),
        });
      })
      .catch();
  }

  getRole(leaderId) {
    const { userId } = this.props.auth;
    return leaderId === userId ? 'leader' : 'evaluator';
  }

  getTabs() {
    const { teamId } = this.props.match.params;
    const { role } = this.state;
    return role === 'leader'
      ? [
        {name: 'Informacija', pathName: `/evaluator/teams/${teamId}/info`},
        {name: 'Vertinimas', pathName: `/evaluator/teams/${teamId}/evaluation`},
        {name: 'Problemos', pathName: `/evaluator/teams/${teamId}/problems`},
        {name: 'Euristikos', pathName: `/evaluator/teams/${teamId}/heuristics`},
        {name: 'Planas', pathName: `/evaluator/teams/${teamId}/plan`},
        {name: 'Vertintojai', pathName: `/evaluator/teams/${teamId}/evaluators`},
      ]
      : [
        {name: 'Informacija', pathName: `/evaluator/teams/${teamId}/info`},
        {name: 'Problemos', pathName: `/evaluator/teams/${teamId}/problems`},
        {name: 'Euristikos', pathName: `/evaluator/teams/${teamId}/heuristics`},
        {name: 'Planas', pathName: `/evaluator/teams/${teamId}/plan`},
      ];
  }

  renderArticleSegment(Component, props) {
    return (
      <Segment attached="bottom">
        <Component
          {...props}
          role={this.state.role}
          teamId={this.props.match.params.teamId}
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
          component={(props) => this.renderArticleSegment(
            EvaluatorRoutes(UserTeamInfoTab),
            { ...props, team: this.state.team },
            )}
        />
        <Route
          path='/evaluator/teams/:teamId/evaluation'
          component={(props) => this.renderArticleSegment(
            TeamLeaderRoutes(UserTeamEvaluationTab),
            props,
          )}
        />
        <Route
          path='/evaluator/teams/:teamId/problems'
          component={() => this.renderArticleSegment(
            EvaluatorRoutes(UserProblemsTableTab),
            {
              ...this.state,
              startUserEvaluation: this.onUserEvaluationStart.bind(this),
            }
          )}
        />
        <Route
          path='/evaluator/teams/:teamId/heuristics'
          component={() => this.renderArticleSegment(
            EvaluatorRoutes(UserTeamHeuristicsTab),
          )}
        />
        <Route
          path='/evaluator/teams/:teamId/plan'
          component={(props) => this.renderArticleSegment(
            EvaluatorRoutes(UserTeamPlanTab),
          )}
        />
        <Route
          path='/evaluator/teams/:teamId/evaluators'
          component={() => this.renderArticleSegment(
            TeamLeaderRoutes(UserTeamEvaluatorsListTab),
          )}
        />
      </Switch>,
    ]
  }
}

export default connect(
  (state) => ({
    teamStates: state.teamStates,
    auth: state.auth,
  }),
  { getTeamStates, getTeamById },
)(UserTeamContainer);
