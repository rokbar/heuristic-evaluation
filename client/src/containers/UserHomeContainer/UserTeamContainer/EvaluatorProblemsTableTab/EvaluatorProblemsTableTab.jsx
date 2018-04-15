import React, { Component } from 'react';

import TeamNotStarted from './TeamNotStarted';
import TeamEvaluationStarted from './TeamEvaluationStarted';
import TeamGeneralization from './TeamGeneralization';
import TeamRatingProblems from './TeamRatingProblems';
import TeamEvaluationFinished from './TeamEvaluationFinished';

class EvaluatorProblemsTableTab extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      role,
      team: { state, heuristicId },
      evaluatorTeam,
      startUserEvaluation,
      submitUserProblems,
      cancelUserProblems,
      teamId
    } = this.props;
    console.log(this.props);

    switch(state) {
      case 1:
        return <TeamNotStarted />;
      case 2:
        return <TeamEvaluationStarted
          role={role}
          state={state}
          teamId={teamId}
          heuristicId={heuristicId}
          evaluatorTeam={evaluatorTeam}
          startUserEvaluation={startUserEvaluation}
          submitUserProblems={submitUserProblems}
          cancelUserProblems={cancelUserProblems}
        />;
      case 3:
        return <TeamGeneralization
          role={role}
          state={state}
          evaluatorTeam={evaluatorTeam}
        />;
      case 4:
        return <TeamRatingProblems
          role={role}
          state={state}
          evaluatorTeam={evaluatorTeam}
          teamId={teamId}
          heuristicId={heuristicId}
        />;
      case 5:
        return <TeamEvaluationFinished
        role={role}
        state={state}
        evaluatorTeam={evaluatorTeam}
      />;
      default: return <div>Puslapis yra nepasiekiamas.</div>
    }
  }
}

export default EvaluatorProblemsTableTab;