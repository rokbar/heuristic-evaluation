import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';

import { getSharedHeuristics } from 'actions/heuristics'
import StartEvaluationForm from './StartEvaluationForm';
import LeaderEvaluationNotFinished from './LeaderEvaluationNotFinished';
import LeaderSubmitted from './LeaderSubmitted';

import { teamState, evaluatorTeamState } from 'utils/enums';

const propTypes = {
  team: PropTypes.object,
  evaluatorTeam: PropTypes.object,
};

const defaultProps = {
  team: null,
  evaluatorTeam: null,
};

class LeaderTeamEvaluationTab extends Component {
  componentDidMount() {
    this.props.getSharedHeuristics();
  }

  renderContent() {
    const { teamId } = this.props.match.params;
    const state = this.props.team.state;
    const evaluatorState = this.props.evaluatorTeam.state;

    if (state === teamState.new) {
      return (
        <StartEvaluationForm
          className="StartEvaluationForm"
          heuristics={this.props.heuristics}
          teamId={teamId}
        />
      );
    }

    if (state === teamState.evaluationStarted) {
      if (
        evaluatorState === evaluatorTeamState.new
        || evaluatorState === evaluatorTeamState.evaluationStarted
      ) return <LeaderEvaluationNotFinished />;

      if (evaluatorState === evaluatorTeamState.submittedProblems)
        return <LeaderSubmitted />;
    }
  }

  render() {
    return (
      <div className="LeaderTeamEvaluationTab">
        <Grid
          textAlign="center"
          style={{height: "100%"}}
          verticalAlign="middle"
        >
          <Grid.Column>
            {this.renderContent()}
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}

LeaderTeamEvaluationTab.propTypes = propTypes;
LeaderTeamEvaluationTab.defaultProps = defaultProps;

function mapStateToProps(state) {
  return { heuristics: state.heuristics };
}

export default connect(
  mapStateToProps,
  { getSharedHeuristics }
)(LeaderTeamEvaluationTab);
