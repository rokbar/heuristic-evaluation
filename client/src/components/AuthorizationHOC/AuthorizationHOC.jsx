import React from 'react';
import { connect } from 'react-redux';

export default function AuthorizationHOC(allowedRoles) {
  return (WrappedComponent) => {
    class WithAuthorization extends React.Component {
      constructor(props) {
        super(props);
      }

      render() {
        const {role} = this.props;
        if (allowedRoles.includes(role)) {
          return <WrappedComponent {...this.props} />
        } else {
          return <h1>No page for you!</h1>
        }
      }
    }

    return connect(state => {
      return { role: state.auth.role }
    })(WithAuthorization);
  }
}
