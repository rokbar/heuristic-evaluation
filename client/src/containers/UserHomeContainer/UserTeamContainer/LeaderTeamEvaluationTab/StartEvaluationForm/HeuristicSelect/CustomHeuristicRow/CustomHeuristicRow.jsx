import React from 'react';
import { Field, FieldArray } from 'redux-form';
import { Form, Button, Icon } from 'semantic-ui-react';

import './CustomHeuristicRow.css';

const renderRules = ({ fields, meta: { error } }) => {
  return [
    <div className="RulesList">
      {fields.map((rule, index) => (
        <div key={index} className="RulesList__item">
          <div className="RulesList__rule">
            <Field
              size="mini"
              name={rule}
              component={Form.Input}
              type="text"
              placeholder="Euristika"
            />
          </div>
          <Icon
            onClick={() => fields.remove(index)}
            name="trash outline"
            size="large"
            color="red"
            link
          />
        </div>
      ))}
    </div>,
    <Button
      type="button"
      size="mini"
      positive
      compact
      onClick={() => fields.push()}
    >
      <Icon name="add circle"/> Pridėti
    </Button>
  ];
};

export default function CustomHeuristicRow(props) {
  return [
    <Field
      name="heuristicName"
      component={Form.Input}
      fluid
      placeholder="Pavadinimas"
    />,
    <p>Panaudojamumo euristikos</p>,
    <FieldArray
      name="rules"
      component={renderRules}
    />
  ];
}
