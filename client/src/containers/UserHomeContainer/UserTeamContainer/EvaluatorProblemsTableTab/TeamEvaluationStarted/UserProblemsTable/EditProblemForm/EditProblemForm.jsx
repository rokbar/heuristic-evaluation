import React, { Component } from 'react';
import {Field, FieldArray, reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import { map } from 'lodash';

import {
  Button,
  Form,
  Grid,
  Segment,
  Divider,
} from 'semantic-ui-react'
import TextAreaFormField from 'components/TextAreaFormField';
import FileInputFormField from 'components/FileInputFormField';
import FormMessage from 'components/FormMessage';
import CheckHeuristicsFormField from '../AddProblemForm/CheckHeuristicsFormField';

import { getProblemById, editProblem } from 'actions/problems';
import { destroyFormState } from 'actions/editForm';

import {
  required,
  minLength10, maxLengthTEXT, maxLength255,
  imageFile, imagesSize,
} from 'utils/fieldLevelValidation';

const FORM_NAME = 'editProblem';

class EditProblemForm extends Component {
  componentDidMount() {
    this.props.destroyFormState();
    this.props.getProblemById({ problemId: this.props.problemId, formName: FORM_NAME });
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
    this.props.destroy(FORM_NAME);
    this.props.destroyFormState();
  }

  getRulesOptions() {
    return map(this.props.rules, (rule) => ({
      text: `${rule.listNumber}. ${rule.description}`,
      value: rule.id,
    }));
  };

  render() {
    const {handleSubmit, editProblem, submitFailed, submitting} = this.props;

    return (
      <div className="AddProblemForm">
        <Grid
          style={{height: "100%"}}
          verticalAlign="middle"
        >
          <Grid.Column>
            <Form onSubmit={handleSubmit(editProblem)} error={submitFailed}>
              <Segment basic>
                <Field
                  name="description"
                  component={TextAreaFormField}
                  label="Aprašymas"
                  placeholder="Aprašymas"
                  required
                  validate={[required, minLength10, maxLengthTEXT]}
                />
                <Field
                  name="location"
                  component={TextAreaFormField}
                  label="Problemos lokacija"
                  placeholder="Problemos lokacija"
                  required
                  validate={[required, minLength10, maxLength255]}
                />
                <Field
                  name="solution"
                  component={TextAreaFormField}
                  label="Taisymo pasiūlymas"
                  placeholder="Taisymo pasiūlymas"
                  validate={[minLength10, maxLengthTEXT]}
                />
                <div className="field">
                  <label>Pažeistos euristikos</label>
                </div>
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
                  validate={[imageFile, imagesSize]}
                />
                <Divider/>
                {submitFailed && <FormMessage
                  type="error"
                  header="Nepavyko išsaugoti pakeitimų"
                  content="Patikrinkite ar formos laukai užpildyti teisingai"
                />}
                <Button
                  style={{marginTop: "20px"}}
                  type="submit"
                  color="teal"
                  size="big"
                  disabled={submitting}
                  loading={submitting}
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
  if (state.editForm[FORM_NAME] && state.editForm[FORM_NAME].data && state.editForm[FORM_NAME].data.problem) {
    const {
      problem: {description, location, solution},
      photos,
      problemrule,
    } = state.editForm[FORM_NAME].data;
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
  form: FORM_NAME,
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
