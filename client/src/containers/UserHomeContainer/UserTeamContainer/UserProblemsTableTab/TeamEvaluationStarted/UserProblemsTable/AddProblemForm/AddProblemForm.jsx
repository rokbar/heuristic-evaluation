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

import { createProblem } from 'actions/problems';
import TextAreaFormField from 'components/TextAreaFormField';
import FileInputFormField from 'components/FileInputFormField';
import CheckHeuristicsFormField from './CheckHeuristicsFormField';

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
    const { handleSubmit, createProblem, handleClose } = this.props;

    return (
      <div className="AddUserForm">
        <Grid
          textAlign="center"
          style={{height: "100%"}}
          verticalAlign="middle"
        >
          <Grid.Column>
            <Form onSubmit={handleSubmit(createProblem)} size="large">
              <Segment stacked>
                <Field
                  name="description"
                  component={TextAreaFormField}
                  placeholder="Aprašymas"
                />
                <Field
                  name="location"
                  component={TextAreaFormField}
                  placeholder="Problemos lokacija"
                />
                <Field
                  name="solution"
                  component={TextAreaFormField}
                  placeholder="Taisymo pasiūlymas"
                />
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
                  type="submit"
                  color="teal"
                  fluid
                  size="large"
                >
                  Pridėti
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
