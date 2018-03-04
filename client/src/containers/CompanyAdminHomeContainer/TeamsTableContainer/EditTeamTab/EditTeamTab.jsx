import React, {Component} from 'react';
import { connect } from 'react-redux';
import {
  Grid,
} from 'semantic-ui-react'

import EditTeamForm from './EditTeamForm';
import TeamMembersList from './TeamMembersList';
import AddUserToTeamForm from './AddUserToTeamForm';
import { getUsersByCompanyId } from 'actions/users';
import { getUsersByTeam } from 'actions/teams';
import { removeUserFromTeam } from 'actions/evaluatorTeam';

const initialState = {
  teamUsers: [],
  teamId: null,
};

class EditTeamTab extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    const { teamId } = this.props.match.params;
    let newState = initialState;

    this.props.getUsersByCompanyId();
    getUsersByTeam({ teamId })
      .then(users => {
        newState.teamUsers = users;
        newState.teamId = teamId;
      });

    this.setState({ ...newState });
  }

  render() {
    return (
      <div className="EditTeamTab">
        <Grid
          textAlign="center"
          style={{height: "100%"}}
          verticalAlign="middle"
        >
          <Grid.Column className="EditTeamForm" style={{maxWidth: 450}}>
            <EditTeamForm
              teamUsers={this.state.teamUsers}
              teamId={this.state.teamId}
            />
            <TeamMembersList
              teamUsers={this.state.teamUsers}
              removeUserFromTeam={this.props.removeUserFromTeam}
              teamId={this.state.teamId}
            />
            <AddUserToTeamForm
              companyUsers={this.props.companyUsers}
              teamId={this.state.teamId}
            />
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}

function mapDispatchToProps(state) {
  return {
    companyUsers: state.users,
  };
}

export default connect(
  mapDispatchToProps,
  { getUsersByCompanyId, removeUserFromTeam }
)(EditTeamTab);
