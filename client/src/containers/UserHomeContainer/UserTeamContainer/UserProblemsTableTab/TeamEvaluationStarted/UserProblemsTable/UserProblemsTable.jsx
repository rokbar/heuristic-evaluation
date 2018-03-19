import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { map, find, toNumber } from 'lodash';

import DataTable from 'components/DataTable';
import AddProblemButton from './AddProblemButton';
import ProblemRowActions from './ProblemRowActions';
import { getEvaluatorProblems } from 'actions/problems';
import { getHeuristicsRules } from 'actions/heuristics';

const propTypes = {
  problems: PropTypes.array,
  heuristicId: PropTypes.number,
};

const defaultProps = {
  problems: [],
  heuristicId: null,
};

class UsersProblemsTable extends Component {
  componentDidMount() {
    const { heuristicId, teamId } = this.props;
    this.props.getHeuristicsRules({ heuristicId });
    this.props.getEvaluatorProblems({ teamId });
  }

  getTableHeaders() {
    return {
      description: 'Aprašymas',
      location: 'Lokacija',
      rules: 'Pažeistia euristika',
      photo: 'Nuotrauka',
      ratingsAverage: 'Įvertinimas',
      solution: 'Pasiūlymas taisymui',
      actions: 'Veiksmai',
    }
  }

  getRulesDescriptionsList(problemRules) {
    const { rules } = this.props.heuristic;

    const mappedRules = map(problemRules.split(','), (id) => {
      const foundRule = find(rules, (x) => x.id === toNumber(id));
      return foundRule ? `${foundRule.listNumber}. ${foundRule.description}` : null;
    });

    return mappedRules.join(' ');
  }

  getTableData() {
    return this.props.problems.map(item => {
      const { id, description, location, photo, ratingsAverage, solution, rules } = item;
      return {
        description,
        location,
        rules: this.getRulesDescriptionsList(rules),
        photo,
        ratingsAverage,
        solution,
        actions: this.renderRowActions(id),
      };
    })
  }

  renderRowActions(problemId) {
    return <ProblemRowActions
      problemId={problemId}
      removeProblem={this.props.removeProblem}
    />
  }

  renderTableActions() {
    return <AddProblemButton />
  }

  render() {
    return(
      <DataTable
        actions={this.renderTableActions()}
        headers={this.getTableHeaders()}
        data={this.getTableData()}
      />
    )
  }
}

UsersProblemsTable.propTypes = propTypes;
UsersProblemsTable.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    problems: state.evaluatorProblems,
    heuristic: state.heuristics[0],
  }
}

export default connect(mapStateToProps, {
  getEvaluatorProblems,
  // removeProblem,
  getHeuristicsRules,
})(UsersProblemsTable);
