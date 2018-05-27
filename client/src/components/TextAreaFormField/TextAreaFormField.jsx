import React from 'react';
import {Form, TextArea} from 'semantic-ui-react';

export default function TextAreaFormField(props) {
  const {meta: {touched, error}} = props;
  return <Form.Field
    fluid
    label={props.label}
    {...props}
    control={TextAreaWithProps}
    error={touched && !!error}
  />;
}

function TextAreaWithProps({input, placeholder, meta: {touched, error}}) {
  return [
    <TextArea
      {...input}
      value={input.value}
      placeholder={placeholder}
      onChange={(param, data) => input.onChange(data.value)}
    />,
    touched && (error && <div className="ui basic red pointing prompt label transition visible">{error}</div>),
  ];
}
