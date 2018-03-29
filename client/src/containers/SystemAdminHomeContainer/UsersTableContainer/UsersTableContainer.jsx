import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { find } from 'lodash';

import DataTable from 'components/DataTable';
import AddUserButton from './AddUserButton';
import UserRowActions from './UserRowActions';
import { getUsers, removeUser } from 'actions/users';
import { getCompanies } from 'actions/companies';

const propTypes = {
  users: PropTypes.array,
};

const defaultProps = {
  users: [],
};

class UsersTableContainer extends Component {
  componentDidMount() {
    this.props.getUsers();
    this.props.getCompanies();
  }

  getTableHeaders() {
    return {
      name: 'Vardas ir pavardė',
      email: 'El. paštas',
      lastLogon: 'Paskutinis prisijungimas',
      company: 'Įmonė',
      actions: 'Veiksmai',
    }
  }

  getCompanyName(companyId) {
    const obj = find(this.props.companies, (item) => (item.id === companyId));
    return obj && obj.name;
  }

  getTableData() {
    return this.props.users.map(item => {
      const { id, name, email, companyId } = item;
      const date = new Date(item.lastLogon);
      const lastLogon =
        `${date.getFullYear()}-${(((date.getMonth() + 1) < 10) ? '0' : '') + (date.getMonth() + 1)}-${((date.getDate() < 10) ? '0' : '') + date.getDate()}`;
      return {
        name,
        email,
        lastLogon,
        company: this.getCompanyName(companyId),
        actions: this.renderRowActions(id),
      };
    })
  }

  renderRowActions(userId) {
    return <UserRowActions
      userId={userId}
      removeUser={this.props.removeUser}
    />
  }

  renderTableActions() {
    return <AddUserButton
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

UsersTableContainer.propTypes = propTypes;
UsersTableContainer.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    users: state.users.all,
    companies: state.companies,
  }
}

export default connect(mapStateToProps, {
  getUsers,
  getCompanies,
  removeUser,
})(UsersTableContainer);