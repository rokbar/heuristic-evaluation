import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DataTable from 'components/DataTable';
import AddUserButton from './AddUserButton';
import { getUsers } from 'actions/users';

const propTypes = {
  users: PropTypes.array,
};

const defaultProps = {
  users: [],
};

class UsersTableContainer extends Component {
  componentDidMount() {
    this.props.getUsers();
  }

  getTableHeaders() {
    return ['name', 'email'];
  }

  getTableData() {
    return this.props.users.map(item => {
      const { name, email } = item;
      return { name, email };
    })
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
    users: state.users,
  }
}

export default connect(mapStateToProps, {
  getUsers,
})(UsersTableContainer);