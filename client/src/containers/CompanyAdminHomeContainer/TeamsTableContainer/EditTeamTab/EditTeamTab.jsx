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

class EditTeamTab extends Component {
  componentDidMount() {
    const { teamId } = this.props.match.params;
    this.props.getUsersByCompanyId();
    this.props.getUsersByTeam({ teamId });
  }

  render() {
    const { teamId } = this.props.match.params;
    return (
      <div className="EditTeamTab">
        <Grid
          textAlign="center"
          style={{height: "100%"}}
          verticalAlign="middle"
        >
          <Grid.Column className="EditTeamForm" style={{maxWidth: 450}}>
            <EditTeamForm
              teamUsers={this.props.teamUsers}
              teamId={teamId}
            />
            <TeamMembersList
              teamUsers={this.props.teamUsers}
              removeUserFromTeam={this.props.removeUserFromTeam}
              teamId={teamId}
            />
            <AddUserToTeamForm
              companyUsers={this.props.companyUsers}
              teamId={teamId}
            />
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}

function mapDispatchToProps(state) {
  return {
    companyUsers: state.users.companyUsers,
    teamUsers: state.users.teamUsers,
  };
}

export default connect(
  mapDispatchToProps,
  { getUsersByCompanyId, getUsersByTeam, removeUserFromTeam }
)(EditTeamTab);
