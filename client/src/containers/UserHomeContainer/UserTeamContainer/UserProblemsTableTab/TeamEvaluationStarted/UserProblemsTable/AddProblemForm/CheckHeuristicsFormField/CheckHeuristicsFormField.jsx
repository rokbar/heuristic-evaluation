import React from 'react';
import { Field } from 'redux-form';

import CheckboxFormField from 'components/CheckboxFormField'

const renderHeuristics = ({ heuristics, fields, meta: { error, touched } }) => {
  return fields.map((rule, index) => {
    const heuristic = heuristics[index];
    return <Field
      name={rule}
      id={rule}
      component={CheckboxFormField}
      type="checkbox"
      label={heuristic.text}
    />;
  })
};

export default renderHeuristics;
