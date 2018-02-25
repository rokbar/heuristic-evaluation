import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import {
  Button,
  Form,
  Grid,
  Header,
  Segment,
} from 'semantic-ui-react'

import { getTeamById, editTeam } from 'actions/teams';

class EditTeamForm extends Component {
  componentDidMount() {
    this.props.getTeamById({ teamId: this.props.match.params.teamId });
    // Dispatch redux-form action to initialize form values from redux-form state
    this.props.initialize();
  }

  render() {
    const {handleSubmit, editTeam } = this.props;

    return (
      <div className="EditTeamForm">
        <Grid
          textAlign="center"
          style={{height: "100%"}}
          verticalAlign="middle"
        >
          <Grid.Column style={{maxWidth: 450}}>
            <Header as="h2" color="teal" textAlign="center">
              Redaguoti komandą
            </Header>
            <Form onSubmit={handleSubmit(editTeam)} size="large">
              <Segment stacked>
                <Field
                  name="name"
                  component={Form.Input}
                  fluid
                  icon="group"
                  iconPosition="left"
                  placeholder="Pavadinimas"
                />
                <Field
                  name="systemName"
                  component={Form.Input}
                  fluid
                  icon="server"
                  iconPosition="left"
                  placeholder="Vertinamos sistemos pavadinimas"
                />
                <Field
                  name="systemUrl"
                  component={Form.Input}
                  fluid
                  icon="browser"
                  iconPosition="left"
                  placeholder="Sistemos adresas"
                />
                <Field
                  name="systemContacts"
                  component={Form.Input}
                  fluid
                  icon="phone"
                  iconPosition="left"
                  placeholder="Sistemos savininkų kontaktai"
                />
                <Button
                  type="submit"
                  color="teal"
                  fluid
                  size="large"
                >
                  Redaguoti
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
  return {
    // redux-form prop which lets to initialize form data
    initialValues: state.editForm.data,
  };
}

EditTeamForm = reduxForm({
  form: 'editTeam',
})(EditTeamForm);

EditTeamForm = connect(
  mapStateToProps,
  { getTeamById, editTeam },
)(EditTeamForm);

export default EditTeamForm;
