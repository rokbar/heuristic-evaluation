import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getTeamsByUser } from 'actions/users';
import { teamState } from 'utils/enums';
import DataTable from 'components/DataTable/index';
import UserTeamRowActions from './UserTeamRowActions/index';

const propTypes = {
  teams: PropTypes.array,
};

const defaultProps = {
  teams: [],
};

class UserTeamsTableContainer extends Component {
  componentDidMount() {
    this.props.getTeamsByUser();
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

  getTableData() {
    return this.props.teams.map(item => {
      const { id, name, systemName, systemUrl, systemContacts, leaderEmail, state } = item;
      return {
        name,
        systemName,
        systemUrl,
        systemContacts,
        state: teamState[state],
        leader: leaderEmail,
        actions: this.renderRowActions(id),
      };
    })
  }

  renderRowActions(teamId) {
    return <UserTeamRowActions
      teamId={teamId}
    />
  }

  render() {
    return(
      <DataTable
        headers={this.getTableHeaders()}
        data={this.getTableData()}
      />
    )
  }
}

UserTeamsTableContainer.propTypes = propTypes;
UserTeamsTableContainer.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    teams: state.teams,
  }
}

export default connect(mapStateToProps, {
  getTeamsByUser,
})(UserTeamsTableContainer);
