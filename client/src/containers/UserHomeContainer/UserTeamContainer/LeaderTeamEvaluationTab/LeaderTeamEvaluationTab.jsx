import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';

import { getSharedHeuristics } from 'actions/heuristics'
import StartEvaluationForm from './StartEvaluationForm';


class LeaderTeamEvaluationTab extends Component {
  componentDidMount() {
    this.props.getSharedHeuristics();
  }

  render() {
    const { teamId } = this.props.match.params;
    console.log(this.props);
    return(
      <div className="LeaderTeamEvaluationTab">
        <Grid
          textAlign="center"
          style={{height: "100%"}}
          verticalAlign="middle"
        >
          <Grid.Column className="StartEvaluationForm">
            <StartEvaluationForm
              heuristics={this.props.heuristics}
              teamId={teamId}
            />
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { heuristics: state.heuristics };
}

export default connect(
  mapStateToProps,
  { getSharedHeuristics }
)(LeaderTeamEvaluationTab);
