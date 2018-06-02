import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';

import {
  Button,
  Form,
  Grid,
  Header,
  Segment
} from 'semantic-ui-react'
import FormMessage from 'components/FormMessage';

import './SignInForm.css';

class SignInForm extends Component {
  render() {
    const {handleSubmit, submitting, submitFailed, error} = this.props;

    return (
      <div className="LoginForm">
        <Grid
          textAlign="center"
          style={{height: "100%"}}
          verticalAlign="middle"
        >
          <Grid.Column style={{maxWidth: 450}}>
            <Header as="h2" color="teal" textAlign="center">
              Prisijungti prie sistemos
            </Header>
            <Form onSubmit={handleSubmit} size="large" error={submitFailed}>
              <Segment stacked>
                <Field
                  name="username"
                  component={Form.Input}
                  fluid
                  icon="user"
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
                {submitFailed && <FormMessage
                  icon='exclamation'
                  size='mini'
                  type="error"
                  header={error}
                />}
                <Button
                  type="submit"
                  color="teal"
                  fluid
                  size="large"
                  disabled={submitting}
                  loading={submitting}
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
}

SignInForm = reduxForm({
  form: 'login',
})(SignInForm);

export default SignInForm;
