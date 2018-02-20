import React, { Component } from 'react';
import { connect } from 'react-redux';
import SignInForm from 'components/SignInForm';
import { localAuth } from 'actions/auth';

class SignInContainer extends Component {
  render() {
    const { localAuth } = this.props;
    return (
      <SignInForm
        onSubmit={localAuth}
      />
    )
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
  };
}

export default connect(null, { localAuth })(SignInContainer);
