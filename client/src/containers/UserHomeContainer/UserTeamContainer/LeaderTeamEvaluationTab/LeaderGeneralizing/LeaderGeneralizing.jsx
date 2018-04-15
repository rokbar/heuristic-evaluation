import React, { Component } from 'react';

import TeamProblemsContainer from 'containers/TeamProblemsContainer';
import GeneralizationProblemsTable from 'components/GeneralizationProblemsTable';
import { Dropdown, Icon } from 'semantic-ui-react';

import { getGeneralizedProblems } from 'actions/mergedProblems';

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

  renderProblemsList() {
    const { selectedList, generalizedProblems } = this.state;
    if (selectedList === 'evaluatorsProblems') {
      return <TeamProblemsContainer {...this.props} />;
    }
    if (selectedList === 'generalizedProblems') {
      return <GeneralizationProblemsTable
        problems={generalizedProblems}
      />;
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
