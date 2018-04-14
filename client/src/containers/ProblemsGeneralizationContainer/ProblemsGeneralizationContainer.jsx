import React, { Component } from 'react';
import { connect } from 'react-redux';
import {filter, map, reduce, uniq} from 'lodash';

import {Segment} from 'semantic-ui-react';
import SelectedEvaluatorProblems from './SelectedEvaluatorProblems';
import GeneralizationProblemsTable from 'components/GeneralizationProblemsTable';
import './ProblemsGeneralizationContainer.css';

import { createMergedProblem, getGeneralizedProblems, removeMergedProblem } from 'actions/mergedProblems';

class ProblemsGeneralizationContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      generalizedProblems: [],
    };
  }

  componentDidMount() {
    getGeneralizedProblems({ teamId: this.props.teamId })
      .then(response => {
        this.setState({
          generalizedProblems: [...response],
        });
      })
      .catch();
  }

  addProblems = (problems) => {
    return new Promise((resolve, reject) => {
      const description = map(problems, 'description').join('\n');
      const location = map(problems, 'location').join('\n');
      const photos = reduce(problems, (mergedPhotos, item) => {
        const paths = map(item.photos, (item) => {
          let pathname = new URL(item).pathname;
          while (pathname.charAt(0) === '/') pathname = pathname.substr(1);
          return pathname;
        });
        return mergedPhotos.concat(paths);
      }, []);
      const rules = uniq(reduce(problems, (mergedRules, item) => mergedRules.concat(item.rules.split(',').map((id) => parseInt(id, 10))), []))
      const evaluatorProblems = map(problems, (item) => ({
        evaluatorId: parseInt(item.users, 10),
        solution: item.solution
      }));
      const mergedProblemIds = map(problems, 'id');

      const mergedProblem = {description, location, photos, rules, evaluatorProblems};

      this.props.createMergedProblem({...mergedProblem, teamId: this.props.teamId, mergedProblemIds})
        .then(result => {
          result && result.description && this.setState(prevState => ({
            generalizedProblems: [
              ...prevState.generalizedProblems,
              result,
            ],
          }));
          // used to update state in SelectedEvaluatorProblems component
          resolve(mergedProblemIds);
        })
        .catch(reject);
    });
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

export default connect(null, {createMergedProblem})(ProblemsGeneralizationContainer);
