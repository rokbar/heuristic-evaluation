import React from 'react';
import { Field, reduxForm } from 'redux-form';
import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment
} from 'semantic-ui-react'
import './AddUserForm.css';

function AddUserForm(props) {
  const { handleSubmit } = props;

  return (
    <div className="AddUserForm">
      <Grid
        textAlign="center"
        style={{ height: "100%" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" color="teal" textAlign="center">
            Sukurti naują vartotoją
          </Header>
          <Form onSubmit={handleSubmit} size="large">
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

AddUserForm = reduxForm({
  form: 'addUser',
})(AddUserForm);

export default AddUserForm;
