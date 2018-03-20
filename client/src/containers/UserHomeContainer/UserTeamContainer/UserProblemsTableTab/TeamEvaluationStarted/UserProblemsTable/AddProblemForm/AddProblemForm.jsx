import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { map } from 'lodash';

import {
  Button,
  Form,
  Grid,
  Header,
  Segment,
} from 'semantic-ui-react'

import { createProblem } from 'actions/problems';
import TextAreaFormField from 'components/TextAreaFormField';
import DropdownFormField from 'components/DropdownFormField';
import FileInputFormField from 'components/FileInputFormField';

class AddProblemForm extends Component {
  componentDidMount() {
    this.props.initialize({ teamId: this.props.teamId });
  }

  getRulesOptions() {
    return map(this.props.rules, (rule) => ({
      text: `${rule.listNumber}. ${rule.description}`,
      value: rule.id,
    }));
  };

  render() {
    const { handleSubmit, createProblem, handleClose } = this.props;
    const ruleOptions = this.getRulesOptions();

    return (
      <div className="AddUserForm">
        <Grid
          textAlign="center"
          style={{height: "100%"}}
          verticalAlign="middle"
        >
          <Grid.Column style={{maxWidth: 450}}>
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
                <Field
                  name="ruleId"
                  component={DropdownFormField}
                  label="Pažeista euristika"
                  options={ruleOptions}
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
