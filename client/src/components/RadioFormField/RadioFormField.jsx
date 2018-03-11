import React, { Component } from 'react';
import { Form, Radio } from 'semantic-ui-react';

export default function RadioFormField(props) {
  return (
    <Form.Field>
      <Radio
        {...props.input}
        checked={props.checked}
      />
    </Form.Field>
  )
}
