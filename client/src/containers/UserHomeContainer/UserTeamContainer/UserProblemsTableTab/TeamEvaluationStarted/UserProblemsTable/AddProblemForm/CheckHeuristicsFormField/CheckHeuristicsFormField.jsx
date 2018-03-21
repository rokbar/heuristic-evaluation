import React from 'react';
import { Field } from 'redux-form';
import { find } from 'lodash';

import CheckboxFormField from 'components/CheckboxFormField'

const renderHeuristics = ({ heuristics, checkedHeuristics = [], fields, meta: { error, touched } }) => {
  return fields.map((rule, index) => {
    const heuristic = heuristics[index];
    const isCheckedBefore = checkedHeuristics.length && heuristics.length
      && find(checkedHeuristics, (ruleId) => ruleId === heuristics[index].value );

    return <Field
      name={rule}
      id={rule}
      component={CheckboxFormField}
      isCheckedBefore={!!isCheckedBefore}
      type="checkbox"
      label={heuristic.text}
    />;
  })
};

export default renderHeuristics;
