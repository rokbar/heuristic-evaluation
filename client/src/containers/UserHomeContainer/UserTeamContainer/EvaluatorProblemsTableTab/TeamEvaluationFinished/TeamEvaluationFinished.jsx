import React, {Component} from 'react';
import {isArray, map, toNumber, find} from 'lodash';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import DataTable from 'components/DataTable';
import {Image, Label, Modal} from 'semantic-ui-react';
import TeamEvaluationFinishedMessage from './TeamEvaluationFinishedMessage';

import {getGeneralizedProblems} from 'actions/mergedProblems';
import {getHeuristicsRules} from 'actions/heuristics';

import {teamState, evaluatorTeamState} from 'utils/enums';

const propTypes = {
  state: PropTypes.number,
  role: PropTypes.string,
  heuristic: PropTypes.object,
};

const defaultProps = {
  state: teamState.ratingProblems,
  role: 'evaluator',
  heuristic: {rules: []},
};

class TeamEvaluationFinished extends Component {
  constructor(props) {
    super(props);
    this.state = {
      problems: [],
    }
  }

  componentDidMount() {
    const {heuristicId, teamId} = this.props;
    this.props.getHeuristicsRules({heuristicId});
    getGeneralizedProblems({teamId})
      .then(response => {
        this.setState({
          problems: [...response],
        });
      })
      .catch();
  }

  getTableHeaders() {
    return {
      description: 'Aprašymas',
      location: 'Lokacija',
      rules: 'Pažeistos euristikos',
      photo: 'Nuotrauka',
      rating: 'Įvertinimų vidurkis',
      solution: 'Pasiūlymas taisymui',
    }
  }

  getRulesDescriptionsList(problemRules) {
    const {rules} = this.props.heuristic;
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

    return mappedRules && mappedRules.join('\n');
  }

  getTableData() {
    return this.state.problems.map(item => {
      const {id, description, location, photos, ratingsAverage, solution, rules} = item;

      return {
        description,
        location,
        rules: this.getRulesDescriptionsList(rules),
        photo: this.renderPhotoCell(photos),
        rating: ratingsAverage,
        solution,
      };
    });
  }

  renderPhotoCell(photos) {
    return photos
      ? <Image.Group size="mini">
        {map(photos, (item, key) => <Modal closeIcon key={key} trigger={<Image style={{cursor: 'pointer'}} src={item}/>}>
          <Image src={item}/>
        </Modal>)}
      </Image.Group>
      : <Image size="small">
        <Label content="Nuotrauka nerasta." icon="warning"/>
      </Image>
  }

  render() {
    return [
      <TeamEvaluationFinishedMessage/>,
      <DataTable
        headers={this.getTableHeaders()}
        data={this.getTableData()}
      />
    ];
  }
}

TeamEvaluationFinished.propTypes = propTypes;
TeamEvaluationFinished.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    heuristic: state.heuristics.team[0],
  }
}

export default connect(mapStateToProps, {getHeuristicsRules})(TeamEvaluationFinished);
