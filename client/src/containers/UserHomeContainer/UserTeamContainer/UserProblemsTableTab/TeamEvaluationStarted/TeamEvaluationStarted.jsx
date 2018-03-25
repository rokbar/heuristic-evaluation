import React, { Component } from 'react';

import { evaluatorTeamState } from 'utils/enums';

import { Button } from 'semantic-ui-react';
import UserProblemsTable from './UserProblemsTable';

class TeamEvaluationStarted extends Component {
  renderUserEvaluationNotStarted() {
    return <Button onClick={this.props.startUserEvaluation}>Pradėti vertinimą</Button>
  }

  renderUserEvaluationStarted() {
    const { heuristicId, teamId, submitUserProblems, cancelUserProblems, evaluatorTeam: { state } } = this.props;
    return <UserProblemsTable
        heuristicId={heuristicId}
        teamId={teamId}
        submitUserProblems={submitUserProblems}
        cancelUserProblems={cancelUserProblems}
        hasSubmittedProblems={state === evaluatorTeamState.submittedProblems}
      />
  }

  render() {
    const { evaluatorTeam: { state } } = this.props;

    return state === evaluatorTeamState.new
      ? this.renderUserEvaluationNotStarted()
      : this.renderUserEvaluationStarted();
  }
}

export default TeamEvaluationStarted;
