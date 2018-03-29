import React, { Component } from 'react';
import {Field, reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import { map } from 'lodash';
import {
  Button,
  Form,
  Grid,
  Header,
  Segment,
} from 'semantic-ui-react'

import { getUserById, editAccount, editPassword } from 'actions/users';
import { destroyFormState } from 'actions/editForm';

class EditAccountContainer extends Component {
  componentDidMount() {
    this.props.getUserById({ userId: this.props.match.params.userId });
    this.props.getCompanies();
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
            <Header as="h2" color="teal" textAlign="center">
              Redaguoti paskyrą
            </Header>
            <Form onSubmit={handleSubmit(editAccount)} size="large">
              <Segment stacked>
                <Field
                  name="name"
                  component={Form.Input}
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="Vardas ir pavardė"
                />
                <Field
                  name="email"
                  component={Form.Input}
                  fluid
                  icon="mail"
                  iconPosition="left"
                  placeholder="El. paštas"
                />
                <Button
                  type="submit"
                  color="teal"
                  fluid
                  size="large"
                >
                  Redaguoti
                </Button>
              </Segment>
            </Form>
            <Header as="h2" color="teal" textAlign="center">
              Keisti slaptažodį
            </Header>
            <Form onSubmit={handleSubmit(editPassword)} size="large">
              <Segment stacked>
                <Field
                  name="password"
                  component={Form.Input}
                  icon="lock"
                  iconPosition="left"
                  placeholder="Slaptažodis"
                  type="password"
                />
                <Field
                  name="confirmPassword"
                  component={Form.Input}
                  icon="repeat"
                  iconPosition="left"
                  placeholder="Pakartoti slaptažodį"
                  type="password"
                />
                <Button
                  type="submit"
                  color="teal"
                  fluid
                  size="large"
                >
                  Keisti
                </Button>
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}

EditAccountContainer = reduxForm({
  form: 'editAccount',
})(EditAccountContainer);

EditAccountContainer = connect(
  mapStateToProps,
  { getUserById, editAccount, editPassword, destroyFormState },
)(EditAccountContainer);

export default EditAccountContainer;
