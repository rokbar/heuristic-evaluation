import React from 'react';
import { connect } from 'react-redux';

import { Segment, Dimmer, Loader } from 'semantic-ui-react';

export default function AuthorizationHOC(allowedRoles) {
  return (WrappedComponent) => {
    class WithAuthorization extends React.Component {
      constructor(props) {
        super(props);
      }

      render() {
        const { role } = this.props;
        if (allowedRoles.includes(role)) {
          return <WrappedComponent {...this.props} />
        } if (!role) {
          return <div style={{height: "100%"}}>
            <Dimmer active inverted>
              <Loader size='large'>Kraunasi...</Loader>
            </Dimmer>
          </div>
        } else {
          return <h1>Puslapis negalimas!</h1>
        }
      }
    }

    return connect(state => {
      return { role: state.auth.role }
    })(WithAuthorization);
  }
}
