import React, { Component } from 'react';

import { evaluatorTeamState } from 'utils/enums';

import { Button } from 'semantic-ui-react';

class TeamEvaluationStarted extends Component {
  renderUserEvaluationNotStarted() {
    return <Button onClick={this.props.startUserEvaluation}>Pradėti vertinimą</Button>
  }

  renderUserEvaluationStarted() {
    return <div>Problems</div>
  }

  render() {
    const { evaluatorTeam: { state } } = this.props;

    return state === evaluatorTeamState.new
      ? this.renderUserEvaluationNotStarted()
      : this.renderUserEvaluationStarted();
  }
}

export default TeamEvaluationStarted;
