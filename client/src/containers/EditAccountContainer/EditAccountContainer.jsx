import React, { Component } from 'react';
import {reduxForm} from 'redux-form';
import {connect} from 'react-redux';

import { Grid } from 'semantic-ui-react'
import EditAccountDetailsForm from './EditAccountDetailsForm';
import EditPasswordForm from './EditPasswordForm';

import { getUserById, editAccount, editPassword } from 'actions/users';
import { destroyFormState } from 'actions/editForm';

class EditAccountContainer extends Component {
  componentDidMount() {
    this.props.destroyFormState();
    this.props.getUserById({ userId: this.props.userId });
  }

  componentWillUnmount() {
    this.props.destroy('editAccount');
    this.props.destroyFormState();
  }

  render() {
    const {handleSubmit, editAccount, editPassword } = this.props;

    return (
      <div className="EditAccountForm">
        <Grid
          textAlign="center"
          style={{height: "100%"}}
          verticalAlign="middle"
        >
          <Grid.Column style={{maxWidth: 450}}>
            <EditAccountDetailsForm
              handleSubmit={handleSubmit}
              editAccount={editAccount}
            />
            <EditPasswordForm
              handleSubmit={handleSubmit}
              editPassword={editPassword}
            />
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    // redux-form prop which lets to initialize form data
    initialValues: state.editForm.data,
    userId: state.auth.userId,
  };
}

EditAccountContainer = reduxForm({
  form: 'editAccount',
})(EditAccountContainer);

EditAccountContainer = connect(
  mapStateToProps,
  { getUserById, editAccount, editPassword, destroyFormState },
)(EditAccountContainer);

export default EditAccountContainer;
