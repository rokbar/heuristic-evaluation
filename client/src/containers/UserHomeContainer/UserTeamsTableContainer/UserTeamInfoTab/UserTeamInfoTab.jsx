import React, {Component} from 'react';
import { connect } from 'react-redux';
import {
  Grid,
} from 'semantic-ui-react'


class UserTeamInfoTab extends Component {
  componentDidMount() {

  }

  render() {
    const { teamId } = this.props.match.params;
    return (
      <div className="UserTeamInfoTab">
        <Grid
          textAlign="center"
          style={{height: "100%"}}
          verticalAlign="middle"
        >
        </Grid>
      </div>
    )
  }
}

function mapDispatchToProps(state) {
  return {

  };
}

export default connect(
  mapDispatchToProps,
)(UserTeamInfoTab);
