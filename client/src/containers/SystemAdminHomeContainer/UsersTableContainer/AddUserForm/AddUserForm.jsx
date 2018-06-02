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

import { addUser } from 'actions/users';
import { getCompanies } from 'actions/companies';
import DropdownFormField from 'components/DropdownFormField';

class AddUserForm extends Component {
  componentDidMount() {
    this.props.getCompanies();
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
    const {handleSubmit, addUser, submitting} = this.props;
    const companyOptions = this.getCompanyOptions();
    const roleOptions = this.getRoleOptions();

    return (
      <div className="AddUserForm">
        <Grid
          textAlign="center"
          style={{height: "100%"}}
          verticalAlign="middle"
        >
          <Grid.Column style={{maxWidth: 450}}>
            <Header as="h2" color="teal" textAlign="center">
              Sukurti naują naudotoją
            </Header>
            <Form onSubmit={handleSubmit(addUser)} size="large">
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
                  name="password"
                  component={Form.Input}
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="Slaptažodis"
                  type="password"
                />
                <Field
                  name="company"
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
    companies: state.companies,
  };
}

AddUserForm = connect(
  mapStateToProps,
  { addUser, getCompanies },
)(AddUserForm);

export default reduxForm({
  form: 'addUser',
})(AddUserForm);
