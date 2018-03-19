import React, {Component} from 'react';
import { connect } from 'react-redux';

import {
  Grid,
  Header,
  Icon,
} from 'semantic-ui-react'
import UserTeamMembersList from './UserTeamMembersList';

import { teamStateLT } from 'utils/enums';

import { getUsersByTeam } from 'actions/teams';

class UserTeamInfoTab extends Component {
  componentDidMount() {
    const { teamId } = this.props.match.params;
    this.props.getUsersByTeam({ teamId });
  }

  render() {
    const { team: { systemName, systemUrl, systemContacts, leaderId, state } } = this.props;
    return (
      <div className="UserTeamInfoTab">
        <Grid
          textAlign="center"
          style={{height: "100%"}}
          verticalAlign="middle"
        >
          <Grid.Column style={{maxWidth: 450}}>
            <Header size='medium'>Vertinama sistema</Header>
            <Grid columns={2} textAlign="left" celled='internally'>
              <Grid.Row>
                <Grid.Column>Sistemos pavadinimas:</Grid.Column>
                <Grid.Column>{systemName}</Grid.Column>
              </Grid.Row>
              <Grid.Row columns={2}>
                <Grid.Column>Sistemos adresas:</Grid.Column>
                <Grid.Column>{systemUrl}</Grid.Column>
              </Grid.Row>
              <Grid.Row columns={2}>
                <Grid.Column>Savininkų kontaktai:</Grid.Column>
                <Grid.Column>{systemContacts}</Grid.Column>
              </Grid.Row>
            </Grid>
            <Header size='medium'>Būsena</Header>
            <Grid columns={2} textAlign="left" celled='internally'>
              <Grid.Row>
                <Grid.Column>{teamStateLT[state]}</Grid.Column>
                <Grid.Column><Icon name="list ol"/></Grid.Column>
              </Grid.Row>
            </Grid>
            <Header size='medium'>Vertintojai</Header>
            <UserTeamMembersList
              teamUsers={this.props.teamUsers}
              leaderId={leaderId}
            />
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    teamUsers: state.users.teamUsers,
  };
}

export default connect(
  mapStateToProps,
  { getUsersByTeam }
)(UserTeamInfoTab);
