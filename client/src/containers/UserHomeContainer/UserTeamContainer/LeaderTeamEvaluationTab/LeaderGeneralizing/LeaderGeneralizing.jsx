import React, { Component } from 'react';
import { filter, map, uniq, reduce } from 'lodash';

import TeamProblemsContainer from 'containers/TeamProblemsContainer';
import GeneralizationProblemsTable from 'components/GeneralizationProblemsTable';
import { Dropdown, Icon } from 'semantic-ui-react';
import SubmitGeneralizedProblemsButton from './SubmitGeneralizedProblemsButton';

import { getGeneralizedProblems, removeMergedProblem, editMergedProblem, mergeMergedProblems } from 'actions/mergedProblems';
import { finishGeneralization } from 'actions/teams';

import './LeaderGeneralizing.css'

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

      mergeMergedProblems({...mergedProblem, teamId: this.props.teamId, mergedProblemIds})
        .then(result => {
          result && result.description && this.setState(prevState => ({
            generalizedProblems: [
              ...prevState.generalizedProblems,
              result,
            ],
          }));
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
    editMergedProblem({ ...problem })
      .then((updatedProblem) => {
        const { id } = updatedProblem;
        const updatedProblems = updatedProblem && map(this.state.generalizedProblems, (item) => {
          return item.id === id ? { ...updatedProblem } : { ...item };
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
