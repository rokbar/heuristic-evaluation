import React, {Component} from 'react';
import {connect} from 'react-redux';
import {map, find, sortBy, get} from 'lodash';

import GeneralizationProblemsTable from 'components/GeneralizationProblemsTable';

import {
  getGeneralizedProblems,
  editMergedProblem,
  changeProblemPosition,
} from 'actions/mergedProblems';
import {getHeuristicsRules} from 'actions/heuristics';

import './LeaderTeamEvaluationFinished.css'

// TODO - duplicate with ProblemsGeneralizationContainer, refactor
class LeaderTeamEvaluationFinished extends Component {
  constructor(props) {
    super(props);
    this.state = {
      generalizedProblems: [],
    }
  }

  componentDidMount() {
    const {getHeuristicsRules, teamId, heuristicId} = this.props;
    getGeneralizedProblems({teamId})
      .then(response => {
        this.setState({
          generalizedProblems: [...response],
        });
        return getHeuristicsRules({heuristicId})
      })
      .catch();
  }

  dragGeneralizedProblem = (problemId, toPosition, wasDraggedUp) => {
    changeProblemPosition({problemId, toPosition, wasDraggedUp})
      .then(positions => {
        const remappedPositions = map(this.state.generalizedProblems, (prob) => {
          const positionFromResponse = get(find(positions, pos => pos.id === prob.id), 'position');
          prob.position = positionFromResponse || prob.position;
          return prob;
        });

        this.setState({generalizedProblems: sortBy(remappedPositions, 'position')});
      })
      .catch();
  };

  editProblem = (problem) => {
    editMergedProblem({...problem})
      .then((updatedProblem) => {
        const {id} = updatedProblem;
        const updatedProblems = updatedProblem && map(this.state.generalizedProblems, (item) => {
          // destructuring item object in both cases, because it contains originalProblemsIds
          // updateProblem lacks originalProblemsIds
          return item.id === id ? {...item, ...updatedProblem} : {...item};
        });
        this.setState({
          generalizedProblems: updatedProblems,
        })
      })
      .catch();
  };

  renderProblemsList() {
    const {generalizedProblems} = this.state;
    const {teamId} = this.props;
    return <div
      className="GeneralizationProblemsTable"
    >
      <GeneralizationProblemsTable
        problems={generalizedProblems}
        editProblem={this.editProblem}
        dragProblem={this.dragGeneralizedProblem}
      />
    </div>;
  }

  render() {
    return <div className="LeaderTeamEvaluationFinished">
      {this.renderProblemsList()}
    </div>
  }
}

export default connect(null, { getHeuristicsRules })(LeaderTeamEvaluationFinished);
