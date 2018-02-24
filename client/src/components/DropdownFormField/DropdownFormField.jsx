import React from 'react';
import { Form, Dropdown } from 'semantic-ui-react';

export default function DropdownFormField(props) {
  return (
    <Form.Field fluid>
      <Dropdown
        {...props.input}
        selection
        value={props.input.value}
        onChange={(param, data) => props.input.onChange(data.value)}
        placeholder={props.label}
        options={props.options}
      />
    </Form.Field>
  )
}
