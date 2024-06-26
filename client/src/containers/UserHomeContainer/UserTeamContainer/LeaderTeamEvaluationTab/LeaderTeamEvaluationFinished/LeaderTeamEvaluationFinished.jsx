import React, {Component} from 'react';
import {connect} from 'react-redux';
import {map, find, sortBy, get, reduce, filter, isArray, keyBy, toString} from 'lodash';

import GeneralizationProblemsTable from 'components/GeneralizationProblemsTable';
import TableCellColorLegend from 'components/GeneralizationProblemsTable/TableCellColorLegend';
import LeaderTeamEvaluationFinishedMessage from './LeaderTeamEvaluationFinishedMessage';
import LeaderGenerateReportButton from './LeaderGenerateReportButton';

import {
  getGeneralizedProblems,
  editMergedProblem,
  changeProblemPosition,
} from 'actions/mergedProblems';
import {getHeuristicsRules} from 'actions/heuristics';
import {getUsersByTeam} from 'actions/teams';

import { teamState } from 'utils/enums';

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
    const {getHeuristicsRules, getUsersByTeam, teamId, heuristicId} = this.props;
    getGeneralizedProblems({teamId})
      .then(response => {
        this.setState({
          generalizedProblems: [...response],
        });
        return getHeuristicsRules({heuristicId})
      })
      .then(() => getUsersByTeam({teamId}))
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

  formatUsersRatings = (problems) => {
    return map(problems, (problemProps) => {
      const {ratings, users} = problemProps;
      const usersWhoFound = isArray(users) ? [...users] : map(users.split(','), userId => parseInt(userId, 10));
      const usersRatings = map(ratings, (ratingProps) => {
        const {value, evaluatorId} = ratingProps;
        return {
          evaluatorId,
          value,
          hasFoundProblem: usersWhoFound.includes(evaluatorId),
        };
      });
      return {
        ...problemProps,
        ...keyBy(usersRatings, ({evaluatorId}) => toString(evaluatorId)),
      }
    });
  };

  getUsersRatingsColDefs = () => {
    const {teamUsers} = this.props;

    const colDefs = reduce(teamUsers, (result, user) => {
      const {id, name, surname} = user;
      const evaluatorInitials = `${name.charAt(0)}${surname.charAt(0)}`;
      const existingUsersInResult = result && result.length && filter(result, ({field}) => {
        return field === id;
      });
      const evaluatorInitialToSet = existingUsersInResult && existingUsersInResult.length ? `${evaluatorInitials}${existingUsersInResult}` : evaluatorInitials;

      result.push({
        headerName: evaluatorInitialToSet.toUpperCase(),
        headerClass: 'header-text-center header-no-padding',
        field: toString(id),
        width: 30,
        suppressFilter: true,
        suppressMenu: true,
        cellRenderer: ({value: {value}}) => `<div>${value}</div>`,
        cellClassRules: {'color--found-problem': ({value: {hasFoundProblem}}) => hasFoundProblem},
      });

      return result;
    }, []);

    return colDefs || [];
  };

  renderProblemsList() {
    const {generalizedProblems} = this.state;
    const {teamId, teamUsers} = this.props;
    return [
      <LeaderTeamEvaluationFinishedMessage/>,
      <div className="GeneralizationProblemsTable__toolbar">
        <LeaderGenerateReportButton
          teamId={teamId}
          disabled={false}
          problems={generalizedProblems}
          teamUsers={teamUsers}
        />
        <TableCellColorLegend />
      </div>,
      <div className="GeneralizationProblemsTable">
        <GeneralizationProblemsTable
          problems={this.formatUsersRatings(generalizedProblems)}
          teamState={teamState.evaluationFinished}
          teamUsers={teamUsers}
          usersRatingsColDefs={this.getUsersRatingsColDefs()}
          editProblem={this.editProblem}
          dragProblem={this.dragGeneralizedProblem}
        />
      </div>
    ];
  }

  render() {
    return <div className="LeaderTeamEvaluationFinished">
      {this.renderProblemsList()}
    </div>
  }
}

function mapStateToProps(state) {
  return {
    teamUsers: state.users.teamUsers,
  };
}

export default connect(mapStateToProps, {
  getHeuristicsRules,
  getUsersByTeam,
})(LeaderTeamEvaluationFinished);
