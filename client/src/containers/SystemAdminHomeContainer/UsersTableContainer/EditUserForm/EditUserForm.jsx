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

import { getUserById, editUser } from 'actions/users';
import { destroyFormState } from 'actions/editForm';
import { getCompanies } from 'actions/companies';
import DropdownFormField from 'components/DropdownFormField';

const FORM_NAME = 'editUser';

class EditUserForm extends Component {
  componentDidMount() {
    this.props.getUserById({
      userId: this.props.match.params.userId,
      formName: FORM_NAME,
    });
    this.props.getCompanies();
  }

  componentWillUnmount() {
    this.props.destroy(FORM_NAME);
    this.props.destroyFormState();
  }

  getCompanyOptions() {
    return map(this.props.companies, (company) => ({
      text: company.name,
      value: company.id,
    }));
  };

  getRoleOptions() {
    return [
      {
        text: 'Vertintojas',
        value: 'evaluator',
      },
      {
        text: 'Įmonės administratorius',
        value: 'companyadmin',
      },
      {
        text: 'Sistemos administratorius',
        value: 'systemadmin'
      },
    ]
  };

  render() {
    const {handleSubmit, editUser } = this.props;
    const companyOptions = this.getCompanyOptions();
    const roleOptions = this.getRoleOptions();

    return (
      <div className="EditUserForm">
        <Grid
          textAlign="center"
          style={{height: "100%"}}
          verticalAlign="middle"
        >
          <Grid.Column style={{maxWidth: 450}}>
            <Header as="h2" color="teal" textAlign="center">
              Redaguoti naudotoją
            </Header>
            <Form onSubmit={handleSubmit(editUser)} size="large">
              <Segment stacked>
                <Field
                  name="name"
                  component={Form.Input}
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="Vardas ir pavardė"
                />
                <Field
                  name="email"
                  component={Form.Input}
                  fluid
                  icon="mail"
                  iconPosition="left"
                  placeholder="El. paštas"
                />
                <Field
                  name="companyId"
                  component={DropdownFormField}
                  label="Įmonė"
                  options={companyOptions}
                />
                <Field
                  name="role"
                  component={DropdownFormField}
                  label="Rolė"
                  options={roleOptions}
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
    initialValues: state.editForm[FORM_NAME] && state.editForm[FORM_NAME].data,
    companies: state.companies,
  };
}

EditUserForm = reduxForm({
  form: FORM_NAME,
})(EditUserForm);

EditUserForm = connect(
  mapStateToProps,
  { getUserById, editUser, getCompanies, destroyFormState },
)(EditUserForm);

export default EditUserForm;
