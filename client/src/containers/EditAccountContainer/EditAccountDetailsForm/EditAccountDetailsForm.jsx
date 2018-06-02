import React from 'react';

import {Field} from 'redux-form';
import {
  Button,
  Form,
  Header,
  Segment,
} from 'semantic-ui-react'

export default function EditAccountDetailsForm({handleSubmit, editAccount, submitting}) {
  return [
    <Header as="h2" color="teal" textAlign="center">
      Redaguoti paskyrą
    </Header>,
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
        <Field
          name="password"
          component={Form.Input}
          fluid
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
          disabled={submitting}
          loading={submitting}
        >
          Redaguoti
        </Button>
      </Segment>
    </Form>
  ];
}
