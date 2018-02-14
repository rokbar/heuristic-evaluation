import React, { Component } from 'react';
import { connect } from 'react-redux';
import SignInForm from 'components/SignInForm';
import { authMethod } from "actions/auth";

class SignInContainer extends Component {
  render() {
    const { signInUser } = this.props;
    return (
      <SignInForm
        onSubmit={authMethod}
      />
    )
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
  };
}

export default connect(mapStateToProps, { authMethod })(SignInContainer);
