import React from 'react';

export default function AuthorizationTeamHOC(allowedRoles) {
  return (WrappedComponent) => {
    class WithAuthorization extends React.Component {
      constructor(props) {
        super(props);
      }

      render() {
        const { role } = this.props;
        if (allowedRoles.includes(role)) {
          return <WrappedComponent {...this.props} />
        } else {
          return <h1>No page for you!</h1>
        }
      }
    }

    return WithAuthorization;
  }
}
