import React, { Component } from 'react';
import {filter, map, reduce} from 'lodash';

import {Segment} from 'semantic-ui-react';
import SelectedEvaluatorProblems from './SelectedEvaluatorProblems';
import GeneralizationProblemsTable from 'components/GeneralizationProblemsTable';
import './ProblemsGeneralizationContainer.css';

import { createMergedProblems, removeMergedProblem } from 'actions/mergedProblems';

class ProblemsGeneralizationContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      generalizedProblems: [],
    };
  }

  addProblems = (problems) => {
    const mergedProblem = {
      description: map(problems, 'description').join('\n'),
      location: map(problems, 'location').join('\n'),
      photos: reduce(problems, (mergedPhotos, item) => mergedPhotos.concat(item.photos), []),
      mergedProblemIds: map(problems, 'id'),

    };
    // createMergedProblems({ mergedProblem })
    //   .then(result => {
        this.setState(prevState => ({
          generalizedProblems: [...prevState.generalizedProblems, ...problems],
        }));
      // });
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
