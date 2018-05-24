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

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.problem && !this.props.problem) {
      const { rules, photos, problem, problemId } = nextProps;
      const rulesId = map(rules, (rule) => (rule.id));

      this.props.initialize({
        ...problem,
        problemId,
        rules: [...rulesId],
        photo: [...photos],
      });
    }
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
          style={{height: "100%"}}
          verticalAlign="middle"
        >
          <Grid.Column>
            <Form onSubmit={handleSubmit(editProblem)}>
              <Segment basic>
                <Field
                  name="description"
                  component={TextAreaFormField}
                  label="Aprašymas"
                  placeholder="Aprašymas"
                />
                <Field
                  name="location"
                  component={TextAreaFormField}
                  label="Problemos lokacija"
                  placeholder="Problemos lokacija"
                />
                <Field
                  name="solution"
                  component={TextAreaFormField}
                  label="Taisymo pasiūlymas"
                  placeholder="Taisymo pasiūlymas"
                />
                <FieldArray
                  name="rules"
                  component={CheckHeuristicsFormField}
                  props={{
                    heuristics: this.getRulesOptions(),
                    checkedHeuristics: this.props.checkedRules,
                  }}
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

function mapStateToProps(state) {
  if (state.editForm.data && state.editForm.data.problem) {
    const {
      problem: {description, location, solution},
      photos,
      problemrule,
    } = state.editForm.data;
    const checkedRules = map(problemrule, (item) => item.ruleId);

    return {
      problem: { description, location, solution },
      checkedRules: checkedRules,
      photos,
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
