import React, { Component } from 'react';
import { connect } from 'react-redux';
import {filter, map, reduce, uniq} from 'lodash';

import {Segment} from 'semantic-ui-react';
import SelectedEvaluatorProblems from './SelectedEvaluatorProblems';
import GeneralizationProblemsTable from 'components/GeneralizationProblemsTable';
import './ProblemsGeneralizationContainer.css';

import {
  createMergedProblem,
  getGeneralizedProblems,
  removeMergedProblem,
  editMergedProblem,
} from 'actions/mergedProblems';

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
      const solution = map(problems, 'solution').join('\n');
      const photos = reduce(problems, (mergedPhotos, item) => {
        const paths = map(item.photos, (item) => {
          let pathname = new URL(item).pathname;
          while (pathname.charAt(0) === '/') pathname = pathname.substr(1);
          return pathname;
        });
        return mergedPhotos.concat(paths);
      }, []);
      const rules = uniq(reduce(problems, (mergedRules, item) => mergedRules.concat(item.rules.split(',').map((id) => parseInt(id, 10))), []));
      const mergedProblemIds = map(problems, 'id');

      const mergedProblem = {description, location, solution, photos, rules};

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

  removeProblem = (problemId) => {
    removeMergedProblem(problemId)
      .then(() => {
        const filteredProblems = problemId && filter(this.state.generalizedProblems, (item) => {
          return item.id !== problemId;
        });
        this.setState({
          generalizedProblems: filteredProblems ? filteredProblems : [],
        });
      })
      .catch();
  };

  editProblem = (problem) => {
    editMergedProblem()
      .then(() => {

      })
      .catch();
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
            editProblem={this.editProblem}
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
