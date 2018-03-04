import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { find } from 'lodash';

import { getTeams } from 'actions/teams';
import { getUsersByCompanyId } from "actions/users";
import { teamState } from 'utils/enums';
import DataTable from 'components/DataTable';
import AddTeamButton from './AddTeamButton';
import TeamRowActions from './TeamRowActions';

const propTypes = {
  teams: PropTypes.array,
};

const defaultProps = {
  teams: [],
};

class TeamsTableContainer extends Component {
  componentDidMount() {
    this.props.getUsersByCompanyId();
    this.props.getTeams();
  }

  getTableHeaders() {
    return {
      name: 'Pavadinimas',
      leader: 'Komandos lyderis',
      state: 'Būsena',
      systemName: 'Vertinama sistema',
      systemUrl: 'Sistemos adresas',
      systemContacts: 'Sistemos savininkų kontaktai',
      actions: 'Veiksmai',
    }
  }

  getLeaderEmail(leaderId) {
    const obj = find(this.props.users, (item) => (item.id === leaderId));
    return obj && obj.email;
  }

  getTableData() {
    return this.props.teams.map(item => {
      const { id, name, systemName, systemUrl, systemContacts, leader_id, state } = item;
      return {
        name,
        systemName,
        systemUrl,
        systemContacts,
        state: teamState[state],
        leader: this.getLeaderEmail(leader_id),
        actions: this.renderRowActions(id),
      };
    })
  }

  renderRowActions(teamId) {
    return <TeamRowActions
      teamId={teamId}
    />
  }

  renderTableActions() {
    return <AddTeamButton
      pushHistory={this.props.pushHistory}
    />
  }

  render() {
    return(
      <DataTable
        actions={this.renderTableActions()}
        headers={this.getTableHeaders()}
        data={this.getTableData()}
      />
    )
  }
}

TeamsTableContainer.propTypes = propTypes;
TeamsTableContainer.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    teams: state.teams,
    users: state.users.companyUsers,
  }
}

export default connect(mapStateToProps, {
  getTeams,
  getUsersByCompanyId,
})(TeamsTableContainer);
