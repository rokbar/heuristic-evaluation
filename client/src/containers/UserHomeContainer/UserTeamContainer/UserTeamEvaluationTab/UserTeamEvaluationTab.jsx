import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getSharedHeuristics } from 'actions/heuristics'

class UserTeamEvaluationTab extends Component {
  componentDidMount() {
    this.props.getSharedHeuristics();
  }

  render() {
    return(
      <div className="UserTeamEvaluationTab">
        <Grid
          textAlign="center"
          style={{height: "100%"}}
          verticalAlign="middle"
        >
          <Grid.Column className="StartEvaluationForm" style={{maxWidth: 450}}>

          </Grid.Column>
        </Grid>
      </div>
    )
  }
}

function mapDispatchToProps(state) {
  return { heuristics: state.heuristics };
}

export default connect(
  mapDispatchToProps,
  { getSharedHeuristics }
)(UserTeamEvaluationTab);
