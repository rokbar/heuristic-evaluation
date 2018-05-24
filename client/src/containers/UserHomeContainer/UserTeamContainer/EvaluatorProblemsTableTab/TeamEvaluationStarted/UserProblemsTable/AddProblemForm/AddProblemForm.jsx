import React, { Component } from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { map } from 'lodash';

import {
  Button,
  Form,
  Grid,
  Segment,
} from 'semantic-ui-react'
import TextAreaFormField from 'components/TextAreaFormField';
import FileInputFormField from 'components/FileInputFormField';
import CheckHeuristicsFormField from './CheckHeuristicsFormField';

import { createProblem } from 'actions/problems';

class AddProblemForm extends Component {
  componentDidMount() {
    const rules = this.getRulesValues();
    this.props.initialize({
      teamId: this.props.teamId,
      rules: [...rules],
    });
  }

  getRulesOptions() {
    return map(this.props.rules, (rule) => ({
      text: `${rule.listNumber}. ${rule.description}`,
      value: rule.id,
    }));
  };

  getRulesValues() {
    return map(this.props.rules, (rule) => (rule.id));
  };

  render() {
    const { handleSubmit, createProblem } = this.props;

    return (
      <div className="AddProblemForm">
        <Grid
          style={{height: "100%"}}
          verticalAlign="middle"
        >
          <Grid.Column>
            <Form onSubmit={handleSubmit(createProblem)}>
              <Segment basic>
                <Field
                  name="description"
                  component={TextAreaFormField}
                  label="Aprašymas"
                  placeholder="Aprašymas"
                  required
                />
                <Field
                  name="location"
                  component={TextAreaFormField}
                  label="Problemos lokacija"
                  placeholder="Problemos lokacija"
                  required
                />
                <Field
                  name="solution"
                  component={TextAreaFormField}
                  label="Taisymo pasiūlymas"
                  placeholder="Taisymo pasiūlymas"
                />
                <div className="field">
                  <label>Pažeistos euristikos</label>
                </div>
                <FieldArray
                  name="rules"
                  component={CheckHeuristicsFormField}
                  props={{ heuristics: this.getRulesOptions() }}
                />
                <Field
                  type="file"
                  name="photo"
                  component={FileInputFormField}
                />
                <Button
                  style={{marginTop: "20px"}}
                  type="submit"
                  color="teal"
                  size="big"
                >
                  Išsaugoti
                </Button>
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}

AddProblemForm = connect(
  null,
  { createProblem },
)(AddProblemForm);

export default reduxForm({
  form: 'createProblem',
})(AddProblemForm);
