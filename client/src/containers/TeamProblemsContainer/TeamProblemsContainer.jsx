import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { map, find, toNumber, isArray } from 'lodash';

import { Modal, Image, Label } from 'semantic-ui-react';
import DataTable from 'components/DataTable';
import StartGeneralizationButton from './StartGeneralizationButton';
import RedirectToMergeProblemsPageButton from './RedirectToMergeProblemsPageButton';

import { getEvaluatorProblems } from 'actions/problems';
import { getHeuristicsRules } from 'actions/heuristics';
import { startGeneralization } from 'actions/teams';

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


class TeamProblemsContainer extends Component {
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
      };
    })
  }

  renderPhotoCell(photos) {
    return photos
      ? <Image.Group size="mini">
        {map(photos, (item, key) => <Modal key={key} trigger={<Image style={{ cursor: 'pointer' }} src={item} />}>
          <Image src={item} />
        </Modal>)}
      </Image.Group>
      : <Image size="small">
        <Label content="Nuotrauka nerasta." icon="warning" />
      </Image>
  }

  renderTableActions() {
    // select user dropdown
  }

  renderPageActions(hasGeneralizationStarted) {
    const { startGeneralization } = this.props;
    return hasGeneralizationStarted
      ? <RedirectToMergeProblemsPageButton
      />
      : <StartGeneralizationButton
        startGeneralization={startGeneralization}
      />
  }

  render() {
    const { hasGeneralizationStarted } = this.props;
    return [
      this.renderPageActions(hasGeneralizationStarted),
      <DataTable
        actions={this.renderTableActions()}
        headers={this.getTableHeaders()}
        data={this.getTableData()}
      />,
    ];
  }
}

TeamProblemsContainer.propTypes = propTypes;
TeamProblemsContainer.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    problems: state.evaluatorProblems,
    heuristic: state.heuristics[0],
  }
}

export default connect(mapStateToProps, {
  getEvaluatorProblems,
  getHeuristicsRules,
  startGeneralization,
})(TeamProblemsContainer);
