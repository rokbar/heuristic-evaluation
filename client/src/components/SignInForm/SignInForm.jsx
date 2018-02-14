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
import './SignInForm.css';

function SignInForm(props) {
  const { handleSubmit } = props;

  return (
    <div className="LoginForm">
      <Grid
        textAlign="center"
        style={{ height: "100%" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" color="teal" textAlign="center">
            Prisijungti prie sistemos
          </Header>
          <Form onSubmit={handleSubmit} size="large">
            <Segment stacked>
              <Field
                name="username"
                component={Form.Input}
                fluid
                icon="user"
                iconPosition="left"
                placeholder="Prisijungimo vardas"
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
                Prisijungti
              </Button>
            </Segment>
          </Form>
        </Grid.Column>
      </Grid>
    </div>
  )
}

SignInForm = reduxForm({
  form: 'login',
})(SignInForm);

export default SignInForm;
