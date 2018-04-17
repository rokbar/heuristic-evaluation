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
  startRatingProblems: PropTypes.func.isRequired,
  finishRatingProblems: PropTypes.func.isRequired,
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
    const {
      evaluatorTeam: { state },
      heuristic: { rules },
      teamId,
      startRatingProblems,
      finishRatingProblems,
    } = this.props;
    const { problems } = this.state;

    switch (state) {
      case evaluatorTeamState.submittedProblems:
        return <ProblemsRatingTable
          teamId={teamId}
          problems={problems}
          hasRatingStarted={false}
          rules={rules}
          startRatingProblems={startRatingProblems}
        />;
      case evaluatorTeamState.ratingProblems:
        return <ProblemsRatingTable
          teamId={teamId}
          problems={problems}
          hasRatingStarted={true}
          rules={rules}
          finishRatingProblems={finishRatingProblems}
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
