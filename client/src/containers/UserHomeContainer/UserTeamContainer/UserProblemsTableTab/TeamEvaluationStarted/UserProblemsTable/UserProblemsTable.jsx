import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { map, find, toNumber, isArray } from 'lodash';

import { Modal, Image, Label } from 'semantic-ui-react';
import DataTable from 'components/DataTable';
import AddProblemFormModal from './AddProblemFormModal';
import ProblemRowActions from './ProblemRowActions';

import { getEvaluatorProblems, removeProblem } from 'actions/problems';
import { getHeuristicsRules } from 'actions/heuristics';

const propTypes = {
  problems: PropTypes.array,
  heuristicId: PropTypes.number,
  heuristic: PropTypes.arrayOf({}),
};

const defaultProps = {
  problems: [],
  heuristicId: null,
  heuristic: [],
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
    let mappedRules;

    if (isArray(problemRules)) {
      mappedRules = problemRules && map(problemRules, (id) => {
        const foundRule = find(rules, (x) => x.id === toNumber(id));
        return foundRule ? `${foundRule.listNumber}. ${foundRule.description}` : null;
      });
    } else {
      mappedRules = problemRules && map(problemRules.split(','), (id) => {
        const foundRule = find(rules, (x) => x.id === toNumber(id));
        return foundRule ? `${foundRule.listNumber}. ${foundRule.description}` : null;
      });
    }

    return mappedRules && mappedRules.join(' ');
  }

  getTableData() {
    return this.props.problems.map(item => {
      const { id, description, location, photos, ratingsAverage, solution, rules } = item;
      return {
        description,
        location,
        rules: this.getRulesDescriptionsList(rules),
        photo: this.renderPhotoCell(photos),
        ratingsAverage,
        solution,
        actions: this.renderRowActions(id),
      };
    })
  }

  renderPhotoCell(photos) {
    return photos
      ? <Image.Group size="mini">
        {map(photos, (item) => <Modal trigger={<Image style={{ cursor: 'pointer' }} src={item} />}>
          <Image src={item} />
        </Modal>)}
      </Image.Group>
      : <Image size="small">
        <Label content="Nuotrauka nerasta." icon="warning" />
      </Image>
  }

  renderRowActions(problemId) {
    const { heuristic: { rules }, teamId, removeProblem } = this.props;
    return <ProblemRowActions
      problemId={problemId}
      removeProblem={removeProblem}
      rules={rules}
      teamId={teamId}
    />
  }

  renderTableActions() {
    const { heuristic: { rules }, teamId } = this.props;
    return <AddProblemFormModal
      rules={rules}
      teamId={teamId}
    />
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
  removeProblem,
  getHeuristicsRules,
})(UsersProblemsTable);
