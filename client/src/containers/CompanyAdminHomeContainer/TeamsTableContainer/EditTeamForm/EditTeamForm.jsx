import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import { map } from 'lodash';
import {
  Button,
  Form,
  Grid,
  Header,
  Segment,
} from 'semantic-ui-react'

import { getUsersByCompanyId } from 'actions/users';
import { getTeamById, editTeam } from 'actions/teams';
import { destroyFormState } from 'actions/editForm';
import DropdownFormField from 'components/DropdownFormField';

class EditTeamForm extends Component {
  componentDidMount() {
    this.props.getUsersByCompanyId();
    this.props.getTeamById({ teamId: this.props.match.params.teamId });
  }

  componentWillUnmount() {
    this.props.destroy('editTeam');
    this.props.destroyFormState();
  }

  getLeaderOptions() {
    return map(this.props.users, (user) => ({
      text: user.email,
      value: user.id,
    }));
  };

  render() {
    const {handleSubmit, editTeam } = this.props;
    const leaderOptions = this.getLeaderOptions();

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
                  name="leader_id"
                  component={DropdownFormField}
                  search
                  label="Komandos lyderis"
                  options={leaderOptions}
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
    users: state.users,
    // redux-form prop which lets to initialize form data
    initialValues: state.editForm.data,
  };
}

EditTeamForm = reduxForm({
  form: 'editTeam',
})(EditTeamForm);

EditTeamForm = connect(
  mapStateToProps,
  {
    getUsersByCompanyId,
    getTeamById,
    editTeam,
    destroyFormState
  },
)(EditTeamForm);

export default EditTeamForm;
