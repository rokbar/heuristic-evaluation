import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';

import { getSharedHeuristics } from 'actions/heuristics'
import StartEvaluationForm from './StartEvaluationForm';

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
          <Grid.Column className="StartEvaluationForm">
            <StartEvaluationForm
              heuristics={this.props.heuristics}
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
)(UserTeamEvaluationTab);
