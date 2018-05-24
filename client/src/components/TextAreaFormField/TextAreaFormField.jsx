import React from 'react';
import { Form, TextArea } from 'semantic-ui-react';

export default function TextAreaFormField(props) {
  return (
    <Form.Field fluid label={props.label} {...props} control={TextAreaWithProps} />
  )
}

function TextAreaWithProps(props) {
  return <TextArea
    {...props.input}
    value={props.input.value}
    placeholder={props.placeholder}
    onChange={(param, data) => props.input.onChange(data.value)}
  />
}
