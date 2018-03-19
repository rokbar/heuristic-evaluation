import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import {
  Button,
  Form,
  Grid,
  Header,
  Segment,
} from 'semantic-ui-react'

import { createProblem } from 'actions/problems';
import TextAreaFormField from 'components/TextAreaFormField';

class AddProblemForm extends Component {
  render() {
    const { handleSubmit, createProblem, handleClose } = this.props;

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
