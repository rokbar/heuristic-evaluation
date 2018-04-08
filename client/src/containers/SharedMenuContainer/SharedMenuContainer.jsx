import React, {Component} from 'react';
import {connect} from 'react-redux';

import FixedMenu from 'components/FixedMenu';

import {logout} from 'actions/auth';

class SharedMenuContainer extends Component {
  render() {
    const {name, role, logout} = this.props;
    return (
      <FixedMenu
        name={name}
        role={role}
        logout={logout}
      />
    )
  }
}

export default connect((state) => {
    return {
      name: state.auth.name,
      role: state.auth.role,
    };
  },
  {logout}
)(SharedMenuContainer);
