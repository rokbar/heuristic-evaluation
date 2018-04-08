import React from 'react';
import { Field } from 'redux-form';
import { Header } from 'semantic-ui-react';

import TextAreaFormField from 'components/TextAreaFormField';

export default function PlanList(props) {
  return [
    <Header size='medium'>Vertinimo planas</Header>,
    <Field
      name="plan"
      component={TextAreaFormField}
      placeholder="Vertinimo planas"
    />
  ]
}
