import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ProblemsRatingTable from 'components/ProblemsRatingTable';

import { getGeneralizedProblems } from 'actions/mergedProblems';
import { getHeuristicsRules } from 'actions/heuristics';

import { teamState, evaluatorTeamState } from 'utils/enums';

const propTypes = {
  state: PropTypes.number,
  role: PropTypes.string,
  evaluatorTeam: PropTypes.object,
  heuristic: PropTypes.object,
};

const defaultProps = {
  state: teamState.ratingProblems,
  role: 'evaluator',
  evaluatorTeam: { state: evaluatorTeamState.submittedProblems },
  heuristic: { rules: [] },
};

class TeamRatingProblems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      problems: [],
    }
  }

  componentDidMount() {
    const { heuristicId, teamId } = this.props;
    this.props.getHeuristicsRules({heuristicId});
    getGeneralizedProblems({ teamId })
      .then(response => {
        this.setState({
          problems: [...response],
        });
      })
      .catch();
  }

  render() {
    const { evaluatorTeam: { state }, heuristic: { rules } } = this.props;
    const { problems } = this.state;

    switch (state) {
      case evaluatorTeamState.submittedProblems:
        return <ProblemsRatingTable
          problems={problems}
          isRatingStarted={false}
          rules={rules}
        />;
      case evaluatorTeamState.ratingProblems:
        return <ProblemsRatingTable
          problems={problems}
          isRatingStarted={true}
          rules={rules}
        />;
      case evaluatorTeamState.evaluationFinished:
        return <div>baigta</div>;
    }
    return <ProblemsRatingTable />
  }
}

TeamRatingProblems.propTypes = propTypes;
TeamRatingProblems.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    heuristic: state.heuristics.team[0],
  }
}

export default connect(mapStateToProps, { getHeuristicsRules })(TeamRatingProblems);
