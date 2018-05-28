import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { map, filter, find, toNumber, isArray, includes } from 'lodash';
import { withRouter } from 'react-router-dom';

import { Modal, Image, Icon, Label, Dropdown } from 'semantic-ui-react';
import DataTable from 'components/DataTable';
import StartGeneralizationButton from './StartGeneralizationButton';
import RedirectToMergeProblemsPageButton from './RedirectToMergeProblemsPageButton';

import { getSelectedEvaluatorProblems } from 'actions/problems';
import { getHeuristicsRules } from 'actions/heuristics';
import { startGeneralization, getUsersByTeam } from 'actions/teams';

import './TeamProblemsContainer.css';

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
  constructor(props) {
    super(props);
    this.state = {
      userOptions: [],
      problemIds: [],
      filteredProblems: [],
    };
  }

  componentDidMount() {
    const { heuristicId, teamId } = this.props;
    let userOptions = [];

    this.props.getHeuristicsRules({heuristicId});
    this.props.getUsersByTeam({ teamId })
      .then(() => {
        userOptions = map(this.props.users, (item) => ({
          value: item.id,
          text: item.email
        }));
        return this.props.getSelectedEvaluatorProblems({teamId});
      })
      .then(() => {
        return this.setState({
          userOptions: userOptions,
          filteredProblems: this.props.problems,
        });
      })
      .catch();
  }

  filterProblemsByUser = (e, data) => {
    const {value} = data;
    const {problems} = this.props;
    let filteredProblems = [];

    if (value && value === 'all') {
      filteredProblems = problems;
    } else {
      filteredProblems = filter(problems, (item) => {
        const users = item.users.split(',').map(Number);
        return includes(users, value);
      });
    }

    this.setState({ filteredProblems });
  };

  getTableHeaders() {
    return {
      description: 'Aprašymas',
      location: 'Lokacija',
      rules: 'Pažeistos euristikos',
      photo: 'Nuotrauka',
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

    return mappedRules && mappedRules.join('\n');
  }

  getTableData() {
    return this.state.filteredProblems.map(item => {
      const { id, description, location, photos, solution, rules, isRevised } = item;
      return {
        description,
        location,
        rules: this.getRulesDescriptionsList(rules),
        photo: this.renderPhotoCell(photos),
        solution,
        completed: isRevised,
      };
    })
  }

  renderPhotoCell(photos) {
    return photos
      ? <Image.Group size="mini">
        {map(photos, (item, key) => <Modal closeIcon key={key} trigger={<Image style={{ cursor: 'pointer' }} src={item} />}>
          <Image src={item} />
        </Modal>)}
      </Image.Group>
      : <Image size="small">
        <Label content="Nuotrauka nerasta." icon="warning" />
      </Image>
  }

  renderTableActions() {
    const evaluatorOptions = [ { value: 'all', text: 'VISŲ narių' }, ...this.state.userOptions ];
    return <span>
      <Icon name="user" size="large" color="teal" />
      <Dropdown
        inline
        options={evaluatorOptions}
        defaultValue={evaluatorOptions[0].value}
        onChange={this.filterProblemsByUser}
      />
      problemos.
    </span>;
  }

  renderPageActions() {
    const { startGeneralization, teamId, hasGeneralizationStarted, changeTeamState, history: { push } } = this.props;
    return hasGeneralizationStarted
      ? <RedirectToMergeProblemsPageButton
        teamId={teamId}
        pushHistory={push}
      />
      : <StartGeneralizationButton
        startGeneralization={startGeneralization}
        changeTeamState={changeTeamState} // This came from UserTeamContainer
        teamId={teamId}
      />
  }

  render() {
    return <div className="TeamProblemsContainer">
      <div className="TeamProblemsContaner__page-actions">
        {this.renderPageActions()}
      </div>
      <DataTable
        actions={this.renderTableActions()}
        headers={this.getTableHeaders()}
        data={this.getTableData()}
      />
    </div>
  }
}

TeamProblemsContainer.propTypes = propTypes;
TeamProblemsContainer.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    problems: state.evaluatorProblems,
    heuristic: state.heuristics.team[0],
    users: state.users.teamUsers,
  }
}

TeamProblemsContainer = withRouter(TeamProblemsContainer);

export default connect(mapStateToProps, {
  getUsersByTeam,
  getSelectedEvaluatorProblems,
  getHeuristicsRules,
  startGeneralization,
})(TeamProblemsContainer);
