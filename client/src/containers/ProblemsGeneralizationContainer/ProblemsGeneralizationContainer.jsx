import React, {Component} from 'react';
import {connect} from 'react-redux';
import {filter, map, reduce, uniq, isArray, includes} from 'lodash';

import {Segment} from 'semantic-ui-react';
import SelectedEvaluatorProblems from './SelectedEvaluatorProblems';
import GeneralizationProblemsTable from 'components/GeneralizationProblemsTable';
import './ProblemsGeneralizationContainer.css';

import {
  createMergedProblem,
  getGeneralizedProblems,
  removeMergedProblem,
  editMergedProblem,
  mergeMergedProblems,
} from 'actions/mergedProblems';

class ProblemsGeneralizationContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      generalizedProblems: [],
    };
  }

  componentDidMount() {
    getGeneralizedProblems({teamId: this.props.teamId})
      .then(response => {
        this.setState({
          generalizedProblems: [...response],
        });
      })
      .catch();
  }


  mergeProblems = (problems) => {
    return new Promise((resolve, reject) => {
      const {problemsToMergeIds, ...mergedProblem} = this.getMergedProblemProps(problems);

      this.props.createMergedProblem({...mergedProblem, teamId: this.props.teamId, problemsToMergeIds})
        .then(result => {
          result && result.description && this.setState(prevState => ({
            generalizedProblems: [
              ...prevState.generalizedProblems,
              result,
            ],
          }));
          // used to update state in SelectedEvaluatorProblems component
          resolve(problemsToMergeIds);
        })
        .catch(reject);
    });
  };

  mergeGeneralizedProblems = (problems) => {
    return new Promise((resolve, reject) => {
      const {problemsToMergeIds, ...mergedProblem} = this.getMergedProblemProps(problems);

      const originalProblemsIds = uniq(reduce(problems, (mergedIds, item) => {
        const idsArray = isArray(item.originalProblemsIds) ? [...item.originalProblemsIds] : item.originalProblemsIds.split(',');
        return mergedIds.concat(idsArray.map(id => parseInt(id, 10)));
      }, []));

      mergeMergedProblems({...mergedProblem, teamId: this.props.teamId, problemsToMergeIds, originalProblemsIds})
        .then(result => {
          result && result.description && this.setState(prevState => ({
            generalizedProblems: [
              ...this.filterMergedProblems([...prevState.generalizedProblems], result.mergedProblemsIds),
              result,
            ],
          }));
          resolve(problemsToMergeIds);
        })
        .catch(reject);
    });
  };

  filterMergedProblems = (previousProblems, mergedProblemsIds = []) => {
    return filter(previousProblems, (item) => !includes(mergedProblemsIds, item.id));
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

  getMergedProblemProps(problems) {
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

    const rules = uniq(reduce(problems, (mergedRules, item) => {
      const rulesArray = isArray(item.rules) ? [...item.rules] : item.rules.split(',');
      return mergedRules.concat(rulesArray.map(id => parseInt(id, 10)));
    }, []));

    const originalProblemsIds = map(problems, 'id');
    const problemsToMergeIds = map(problems, 'id');

    return {description, location, solution, photos, rules, problemsToMergeIds, originalProblemsIds};
  }

  render() {
    const {teamId, heuristicId} = this.props;
    const {generalizedProblems} = this.state;

    return (
      <div className="ProblemsGeneralization">
        <Segment className="MergedProblems">
          <GeneralizationProblemsTable
            problems={generalizedProblems}
            removeProblem={this.removeProblem}
            editProblem={this.editProblem}
            mergeProblems={this.mergeGeneralizedProblems}
          />
        </Segment>
        <Segment className="EvaluatorProblems">
          <SelectedEvaluatorProblems
            heuristicId={heuristicId}
            teamId={teamId}
            mergeProblems={this.mergeProblems}
          />
        </Segment>
      </div>
    );
  }
}

export default connect(null, {createMergedProblem})(ProblemsGeneralizationContainer);
