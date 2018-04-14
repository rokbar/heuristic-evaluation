import React, { Component } from 'react';
import filter from 'lodash';

import {Segment} from 'semantic-ui-react';
import SelectedEvaluatorProblems from './SelectedEvaluatorProblems';
import GeneralizationProblemsTable from 'components/GeneralizationProblemsTable';
import './ProblemsGeneralizationContainer.css';

class ProblemsGeneralizationContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      generalizedProblems: [],
    };
  }

  addProblems = (problems) => {
    this.setState(prevState => ({
      generalizedProblems: [...prevState.generalizedProblems, ...problems],
    }));
  };

  removeProblem = (problem) => {
    const filteredProblems = problem && filter(this.state.generalizedProblems, (item) => {
      return item.id !== problem.id;
    });
    this.setState({
      generalizedProblems: filteredProblems ? filteredProblems : [],
    });
  };

  render() {
    const { teamId, heuristicId } = this.props;
    const { generalizedProblems } = this.state;

    return (
      <div className="ProblemsGeneralization">
        <Segment className="MergedProblems">
          <GeneralizationProblemsTable
            problems={generalizedProblems}
            removeProblem={this.removeProblem}
          />
        </Segment>
        <Segment className="EvaluatorProblems">
          <SelectedEvaluatorProblems
            heuristicId={heuristicId}
            teamId={teamId}
            moveProblems={this.addProblems}
          />
        </Segment>
      </div>
    );
  }
}

export default ProblemsGeneralizationContainer;
