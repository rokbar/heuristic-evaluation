import React, {Component} from 'react';
import {Field, FieldArray, reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import {map} from 'lodash';

import {
  Button,
  Form,
  Grid,
  Segment,
  Divider,
} from 'semantic-ui-react'
import FormMessage from 'components/FormMessage';
import TextAreaFormField from 'components/TextAreaFormField';
import FileInputFormField from 'components/FileInputFormField';
import CheckHeuristicsFormField from './CheckHeuristicsFormField';

import {createProblem} from 'actions/problems';

import {required, minLength10, maxLengthTEXT, maxLength255, imageFile} from 'utils/fieldLevelValidation';

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
    const {handleSubmit, createProblem, submitFailed} = this.props;

    return (
      <div className="AddProblemForm">
        <Grid
          style={{height: "100%"}}
          verticalAlign="middle"
        >
          <Grid.Column>
            <Form onSubmit={handleSubmit(createProblem)} error={submitFailed}>
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
                  props={{heuristics: this.getRulesOptions()}}
                />
                <Field
                  type="file"
                  name="photo"
                  component={FileInputFormField}
                  validate={imageFile}
                />
                <Divider/>
                {submitFailed && <FormMessage
                  type="error"
                  header="Nepavyko sukurti problemos"
                  content="Patikrinkite ar formos laukai užpildyti teisingai"
                />}
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
  {createProblem},
)(AddProblemForm);

export default reduxForm({
  form: 'createProblem',
})(AddProblemForm);
