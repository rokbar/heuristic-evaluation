import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {map, filter, find, toNumber, isArray, includes} from 'lodash';

import {Modal, Image, Icon, Label, Dropdown, Checkbox} from 'semantic-ui-react';
import DataTable from 'components/DataTable';
import MoveToGeneralizedProblemsButton from './MoveToGeneralizedProblemsButton';

import {getSelectedEvaluatorProblems} from 'actions/problems';
import {getHeuristicsRules} from 'actions/heuristics';
import {startGeneralization} from 'actions/teams';
import {getUsersByCompanyId} from 'actions/users';

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

class SelectedEvaluatorProblems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userOptions: [],
      problemIds: [],
      filteredProblems: [],
      checkedProblems: [],
    };
  }

  componentDidMount() {
    const {heuristicId, teamId} = this.props;
    let userOptions = [];

    this.props.getHeuristicsRules({heuristicId});
    this.props.getUsersByCompanyId()
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

  handleCheckboxChange = (data, problemId) => {
    const {checked} = data;

    if (checked && problemId) {
      this.setState(prevState => ({
        checkedProblems: [...prevState.checkedProblems, problemId],
      }));
    } else if (problemId) {
      const checkedProblems = filter(this.state.checkedProblems, (item) => {
        return item !== problemId;
      });
      this.setState({checkedProblems: checkedProblems});
    }
  };

  handleMergeProblemsClick = () => {
    const { mergeProblems } = this.props;
    const { filteredProblems, checkedProblems } = this.state;
    const problemsToMove = filter(filteredProblems, (item) => {
      return item && includes(checkedProblems, item.id);
    });

    mergeProblems(problemsToMove)
      .then(problemIds => {
        const updatedProblems = map(this.state.filteredProblems, (item) => includes(problemIds, item.id)
          ? { ...item, isRevised: true }
          : { ...item }
        );
        this.setState({ filteredProblems: updatedProblems });
      })
      .catch();
  };

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

    this.setState({filteredProblems, checkedProblems: []});
  };

  getTableHeaders() {
    return {
      checkbox: null,
      description: 'Aprašymas',
      location: 'Lokacija',
      rules: 'Pažeistos euristikos',
      photo: 'Nuotrauka',
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

    return mappedRules && mappedRules.join(' ');
  }

  getTableData() {
    return this.state.filteredProblems.map(item => {
      const {id, description, location, photos, solution, rules, isRevised} = item;
      return {
        checkbox: this.renderSelectProblemCheckbox(id),
        description,
        location,
        rules: this.getRulesDescriptionsList(rules),
        photo: this.renderPhotoCell(photos),
        solution,
        completed: isRevised
      };
    })
  }

  renderSelectProblemCheckbox(problemId) {
    return <Checkbox
      onChange={(e, data) => this.handleCheckboxChange(data, problemId)}
      checked={includes(this.state.checkedProblems, problemId)}
    />;
  };

  renderPhotoCell(photos) {
    return photos
      ? <Image.Group size="mini">
        {map(photos, (item, key) => <Modal key={key} trigger={<Image style={{cursor: 'pointer'}} src={item}/>}>
          <Image src={item}/>
        </Modal>)}
      </Image.Group>
      : <Image size="small">
        <Label content="Nuotrauka nerasta." icon="warning"/>
      </Image>
  }

  renderTableActions() {
    const evaluatorOptions = [{value: 'all', text: 'VISŲ narių'}, ...this.state.userOptions];
    return (
      <div>
        <span>
          <Icon name="user" size="large" color="teal"/>
          <Dropdown
            inline
            options={evaluatorOptions}
            defaultValue={evaluatorOptions[0].value}
            onChange={this.filterProblemsByUser}
          />
          problemos.
        </span>
        <MoveToGeneralizedProblemsButton
          checkedProblems={this.state.checkedProblems}
          handleMergeProblemsClick={this.handleMergeProblemsClick}
        />
      </div>
    );
  }

  render() {
    return [
      <DataTable
        actions={this.renderTableActions()}
        headers={this.getTableHeaders()}
        data={this.getTableData()}
      />
    ];
  }
}

SelectedEvaluatorProblems.propTypes = propTypes;
SelectedEvaluatorProblems.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    problems: state.evaluatorProblems,
    heuristic: state.heuristics.team[0],
    users: state.users.companyUsers,
  }
}

export default connect(mapStateToProps, {
  getUsersByCompanyId,
  getSelectedEvaluatorProblems,
  getHeuristicsRules,
  startGeneralization,
})(SelectedEvaluatorProblems);
