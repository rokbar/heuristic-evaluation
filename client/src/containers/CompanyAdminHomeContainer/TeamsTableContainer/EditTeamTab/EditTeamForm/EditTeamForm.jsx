import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import {map} from 'lodash';
import {
  Button,
  Form,
  Header,
  Segment,
} from 'semantic-ui-react'

import {getTeamById, editTeam} from 'actions/teams';
import {destroyFormState} from 'actions/editForm';
import DropdownFormField from 'components/DropdownFormField';

const FORM_NAME = 'editTeam';

class EditTeamForm extends Component {
  componentDidMount() {
    this.props.getTeamById({
      teamId: this.props.teamId,
      formName: FORM_NAME,
    });
  }

  componentWillUnmount() {
    this.props.destroy(FORM_NAME);
    this.props.destroyFormState();
  }

  getLeaderOptions() {
    return map(this.props.teamUsers, (user) => ({
      text: user.email,
      value: user.id,
    }));
  };

  render() {
    const {handleSubmit, editTeam, submitting} = this.props;
    const leaderOptions = this.getLeaderOptions();

    return [
      <Header as="h2" color="teal" textAlign="center">
        Redaguoti komandą
      </Header>,
      <Form onSubmit={handleSubmit(editTeam)} className="EditTeamForm" size="large">
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
            name="leaderId"
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
            disabled={submitting}
            loading={submitting}
          >
            Redaguoti
          </Button>
        </Segment>
      </Form>
    ]
  }
}

function mapStateToProps(state) {
  return {
    // redux-form prop which lets to initialize form data
    initialValues: state.editForm[FORM_NAME] && state.editForm[FORM_NAME].data,
  };
}

EditTeamForm = reduxForm({
  form: FORM_NAME,
})(EditTeamForm);

EditTeamForm = connect(
  mapStateToProps,
  {
    getTeamById,
    editTeam,
    destroyFormState
  },
)(EditTeamForm);

export default EditTeamForm;
