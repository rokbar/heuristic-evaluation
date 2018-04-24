import React, { Component } from 'react';
import { filter, map, uniq, reduce, isArray, includes, find, sortBy, get } from 'lodash';

import TeamProblemsContainer from 'containers/TeamProblemsContainer';
import GeneralizationProblemsTable from 'components/GeneralizationProblemsTable';
import { Dropdown, Icon } from 'semantic-ui-react';
import SubmitGeneralizedProblemsButton from './SubmitGeneralizedProblemsButton';

import {
  getGeneralizedProblems,
  removeMergedProblem,
  editMergedProblem,
  mergeMergedProblems,
  changeProblemPosition,
} from 'actions/mergedProblems';
import { finishGeneralization } from 'actions/teams';

import './LeaderGeneralizing.css'

// TODO - duplicate with ProblemsGeneralizationContainer, refactor
class LeaderGeneralizing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedList: 'evaluatorsProblems',
      generalizedProblems: [],
    }
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

  changeSelectedList = (e, data) => {
    const {value} = data;
    this.setState({ selectedList: value });
  };

  renderProblemListOptions() {
    const listOptions = [
      { value: 'evaluatorsProblems', text: 'Vertintojų užregistruotos'},
      { value: 'generalizedProblems', text: 'Apibendrintos' },
    ];
    return <span>
      <Icon name="list layout" size="large" color="teal" />
      <Dropdown
        inline
        options={listOptions}
        defaultValue={listOptions[0].value}
        onChange={this.changeSelectedList}
      />
      problemos.
    </span>;
  };

  mergeGeneralizedProblems = (problems) => {
    return new Promise((resolve, reject) => {
      // highest problem's in list position, from this position all below existing problems' positions will be updated
      const position = problems.length && get(sortBy(problems, 'position')[0], 'position');
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

      const originalProblemsIds = uniq(reduce(problems, (mergedIds, item) => {
        const idsArray = isArray(item.originalProblemsIds) ? [...item.originalProblemsIds] : item.originalProblemsIds.split(',');
        return mergedIds.concat(idsArray.map(id => parseInt(id, 10)));
      }, []));

      const problemsToMergeIds = map(problems, 'id');
      const mergedProblem = {position, description, location, solution, photos, rules, originalProblemsIds};

      mergeMergedProblems({...mergedProblem, teamId: this.props.teamId, problemsToMergeIds})
        .then(result => {
          result && result.description && this.setState(prevState => ({
            generalizedProblems: [
              ...this.filterMergedProblems([...prevState.generalizedProblems, result], result.mergedProblemsIds),
            ],
          }));
          resolve(problemsToMergeIds);
        })
        .catch(reject);
    });
  };

  dragGeneralizedProblem = (problemId, toPosition, wasDraggedUp) => {
    changeProblemPosition({problemId, toPosition, wasDraggedUp})
      .then(positions => {
        const remappedPositions = map(this.state.generalizedProblems, (prob) => {
          const positionFromResponse = get(find(positions, pos => pos.id === prob.id), 'position');
          prob.position = positionFromResponse || prob.position;
          return prob;
        });

        this.setState({ generalizedProblems: sortBy(remappedPositions, 'position') });
      })
      .catch();
  };

  filterMergedProblems = (previousProblems, mergedProblemsIds = []) => {
    const filteredProblems = filter(previousProblems, (item) => !includes(mergedProblemsIds, item.id));
    let position = 1;
    return map(sortBy(filteredProblems, 'position'), (item => ({ ...item, position: position++ }))); // recalculate positions
  };

  removeProblem = (problemId) => {
    removeMergedProblem(problemId)
      .then(() => {
        const filteredProblems = problemId && filter(this.state.generalizedProblems, (item) => {
          return item.id !== problemId;
        });
        let position = 1;
        const recalculatedPositions = map(filteredProblems, (item => ({ ...item, position: position++ }))); // recalculate positions
        this.setState({
          generalizedProblems: recalculatedPositions ? recalculatedPositions : [],
        });
      })
      .catch();
  };

  editProblem = (problem) => {
    editMergedProblem({ ...problem })
      .then((updatedProblem) => {
        const { id } = updatedProblem;
        const updatedProblems = updatedProblem && map(this.state.generalizedProblems, (item) => {
          // destructuring item object in both cases, because it contains originalProblemsIds
          // updateProblem lacks originalProblemsIds
          return item.id === id ? { ...item, ...updatedProblem } : { ...item };
        });
        this.setState({
          generalizedProblems: updatedProblems,
        })
      })
      .catch();
  };

  renderProblemsList() {
    const { selectedList, generalizedProblems } = this.state;
    const { heuristicId, teamId, changeTeamState, hasGeneralizationStarted } = this.props;
    if (selectedList === 'evaluatorsProblems') {
      return <TeamProblemsContainer
        heuristicId={heuristicId}
        teamId={teamId}
        hasGeneralizationStarted={hasGeneralizationStarted}
      />;
    }
    if (selectedList === 'generalizedProblems') {
      return <div
        className="GeneralizationProblemsTable"
      >
        <SubmitGeneralizedProblemsButton
          changeTeamState={changeTeamState}
          finishGeneralization={finishGeneralization}
          teamId={teamId}
        />
        <GeneralizationProblemsTable
          problems={generalizedProblems}
          removeProblem={this.removeProblem}
          editProblem={this.editProblem}
          mergeProblems={this.mergeGeneralizedProblems}
          dragProblem={this.dragGeneralizedProblem}
        />
      </div>;
    }
  }

  render() {
    return <div className="LeaderGeneralizing">
      {this.renderProblemListOptions()}
      {this.renderProblemsList()}
    </div>
  }
}

export default LeaderGeneralizing;
