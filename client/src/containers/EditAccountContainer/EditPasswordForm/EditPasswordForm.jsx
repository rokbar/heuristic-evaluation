import React from 'react';

import {Field} from 'redux-form';
import {
  Button,
  Form,
  Header,
  Segment,
} from 'semantic-ui-react'

export default function EditAccountDetailsForm({handleSubmit, editPassword}) {
  return [
    <Header as="h2" color="teal" textAlign="center">
      Keisti slaptažodį
    </Header>,
    <Form onSubmit={handleSubmit(editPassword)} size="large">
      <Segment stacked>
        <Field
          name="currentPassword"
          component={Form.Input}
          icon="unlock alternate"
          iconPosition="left"
          placeholder="Dabartinis slaptažodis"
          type="password"
        />
        <Field
          name="newPassword"
          component={Form.Input}
          icon="lock"
          iconPosition="left"
          placeholder="Naujas slaptažodis"
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
  ];
}
