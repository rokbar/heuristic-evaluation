import React, { Component } from 'react';

import {Segment} from 'semantic-ui-react';
import SelectedEvaluatorProblems from './SelectedEvaluatorProblems';
import './ProblemsGeneralizationContainer.css';

class ProblemsGeneralizationContainer extends Component {
  render() {
    const { teamId, heuristicId } = this.props;
    return (
      <div className="ProblemsGeneralization">
        <Segment className="MergedProblems">
          Apibendrintas sąrašas
        </Segment>
        <Segment className="EvaluatorProblems">
          <SelectedEvaluatorProblems
            heuristicId={heuristicId}
            teamId={teamId}
          />
        </Segment>
      </div>
    );
  }
}

export default ProblemsGeneralizationContainer;
