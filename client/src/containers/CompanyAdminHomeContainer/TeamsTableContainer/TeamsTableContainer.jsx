import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DataTable from 'components/DataTable';
import AddTeamButton from './AddTeamButton';
import TeamRowActions from './TeamRowActions';
import { getTeams } from 'actions/teams';

const propTypes = {
  teams: PropTypes.array,
};

const defaultProps = {
  teams: [],
};

class TeamsTableContainer extends Component {
  componentDidMount() {
    this.props.getTeams();
  }

  getTableHeaders() {
    return {
      name: 'Pavadinimas',
      systemName: 'Vertinamos sistemos pavadinimas',
      systemUrl: 'Sistemos adresas',
      systemContacts: 'Sistemos savininkų kontaktai',
      actions: 'Veiksmai',
    }
  }
  getTableData() {
    return this.props.teams.map(item => {
      const { id, name, systemName, systemUrl, systemContacts } = item;
      return {
        name,
        systemName,
        systemUrl,
        systemContacts,
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
  }
}

export default connect(mapStateToProps, {
  getTeams,
})(TeamsTableContainer);
