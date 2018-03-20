import React, { Component } from 'react';
import {Field, FieldArray, reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import { map } from 'lodash';

import {
  Button,
  Form,
  Grid,
  Segment,
} from 'semantic-ui-react'
import TextAreaFormField from 'components/TextAreaFormField';
import FileInputFormField from 'components/FileInputFormField';
import CheckHeuristicsFormField from '../AddProblemForm/CheckHeuristicsFormField';

import { getProblemById, editProblem } from 'actions/problems';
import { destroyFormState } from 'actions/editForm';

class EditProblemForm extends Component {
  componentDidMount() {
    this.props.destroyFormState();
    this.props.getProblemById({ problemId: this.props.problemId });
  }

  componentWillUnmount() {
    this.props.destroy('editTeam');
    this.props.destroyFormState();
  }

  getRulesOptions() {
    return map(this.props.rules, (rule) => ({
      text: `${rule.listNumber}. ${rule.description}`,
      value: rule.id,
    }));
  };

  render() {
    const {handleSubmit, editProblem } = this.props;

    return (
      <div className="AddProblemForm">
        <Grid
          textAlign="center"
          style={{height: "100%"}}
          verticalAlign="middle"
        >
          <Grid.Column>
            <Form onSubmit={handleSubmit(editProblem)} size="large">
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

function mapStateToProps(state) {
  if (state.editForm.data.problem) {
    const {
      problem: {description, location, photo},
      problemrule,
      evaluatorproblem: {solution}
    } = state.editForm.data;
    const rules = map(problemrule, (item) => item.ruleId);

    return {
      // redux-form prop which lets to initialize form data
      initialValues: { description, location, photo, solution, rules },
    };
  } else {
    return {}
  }
}

EditProblemForm = reduxForm({
  form: 'editProblem',
})(EditProblemForm);

EditProblemForm = connect(
  mapStateToProps,
  {
    getProblemById,
    editProblem,
    destroyFormState
  },
)(EditProblemForm);

export default EditProblemForm;
