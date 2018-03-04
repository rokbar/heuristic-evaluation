import React, { Component } from 'react';
import {Field, reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import { map } from 'lodash';
import {
  Button,
  Form,
  Header,
  Segment,
} from 'semantic-ui-react'

import DropdownFormField from 'components/DropdownFormField';
import { addUserToTeam } from 'actions/evaluatorTeam';

class AddUserToTeamForm extends Component {
  componentDidMount() {
    this.props.initialize({ team_id: this.props.teamId });
  }

  getUserOptions() {
    return map(this.props.companyUsers, (user) => ({
      text: user.email,
      value: user.id,
    }));
  };

  render() {
    const {handleSubmit, addUserToTeam, teamId } = this.props;
    const userOptions = this.getUserOptions();

    return [
      <Header as="h2" color="teal" textAlign="center">
        Pridėti vertintoją į komandą
      </Header>,
      <Form onSubmit={handleSubmit(addUserToTeam)} className="AddUserToTeamForm" size="large">
        <Segment stacked>
          <Field
            name="evaluator_id"
            component={DropdownFormField}
            search
            label="Vertintojai"
            options={userOptions}
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
    ]
  }
}

AddUserToTeamForm = reduxForm({
  form: 'addUserToTeam',
})(AddUserToTeamForm);

AddUserToTeamForm = connect(
  null,
  {
    addUserToTeam,
  },
)(AddUserToTeamForm);

export default AddUserToTeamForm;
