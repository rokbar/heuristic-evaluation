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

import { addTeam } from 'actions/teams';

class AddTeamForm extends Component {
  render() {
    const {handleSubmit, addTeam, submitting} = this.props;

    return (
      <div className="AddTeamForm">
        <Grid
          textAlign="center"
          style={{height: "100%"}}
          verticalAlign="middle"
        >
          <Grid.Column style={{maxWidth: 450}}>
            <Header as="h2" color="teal" textAlign="center">
              Sukurti naują komandą
            </Header>
            <Form onSubmit={handleSubmit(addTeam)} size="large">
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
                  disabled={submitting}
                  loading={submitting}
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
  return {
  };
}

AddTeamForm = reduxForm({
  form: 'addTeam',
})(AddTeamForm);

AddTeamForm = connect(
  mapStateToProps,
  { addTeam },
)(AddTeamForm);

export default AddTeamForm;
