import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import {
  Button,
  Form,
  Grid,
  Header,
  Segment
} from 'semantic-ui-react'

import { addUser } from 'actions/users';
import './AddUserForm.css';

class AddUserForm extends Component {
  render() {
    const {handleSubmit, addUser } = this.props;

    return (
      <div className="AddUserForm">
        <Grid
          textAlign="center"
          style={{height: "100%"}}
          verticalAlign="middle"
        >
          <Grid.Column style={{maxWidth: 450}}>
            <Header as="h2" color="teal" textAlign="center">
              Sukurti naują vartotoją
            </Header>
            <Form onSubmit={handleSubmit(addUser)} size="large">
              <Segment stacked>
                <Field
                  name="name"
                  component={Form.Input}
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="Vardas"
                />
                <Field
                  name="email"
                  component={Form.Input}
                  fluid
                  icon="mail"
                  iconPosition="left"
                  placeholder="El. paštas"
                />
                <Field
                  name="password"
                  component={Form.Input}
                  icon="lock"
                  iconPosition="left"
                  placeholder="Slaptažodis"
                  type="password"
                />
                <Button
                  type="submit"
                  color="teal"
                  fluid
                  size="large"
                >
                  Pridėti
                </Button>
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}

AddUserForm = connect(
  null,
  { addUser },
)(AddUserForm);

export default reduxForm({
  form: 'addUser',
})(AddUserForm);
