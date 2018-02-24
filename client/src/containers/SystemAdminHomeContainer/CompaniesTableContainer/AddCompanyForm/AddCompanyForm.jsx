import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import {
  Button,
  Form,
  Grid,
  Header,
  Segment
} from 'semantic-ui-react'

import { addCompany } from 'actions/companies';
import './AddCompanyForm.css';

class AddCompanyForm extends Component {
  render() {
    const {handleSubmit, addCompany } = this.props;

    return (
      <div className="AddCompanyForm">
        <Grid
          textAlign="center"
          style={{height: "100%"}}
          verticalAlign="middle"
        >
          <Grid.Column style={{maxWidth: 450}}>
            <Header as="h2" color="teal" textAlign="center">
              Sukurti naują įmonę
            </Header>
            <Form onSubmit={handleSubmit(addCompany)} size="large">
              <Segment stacked>
                <Field
                  name="name"
                  component={Form.Input}
                  fluid
                  placeholder="Pavadinimas"
                />
                <Field
                  name="country"
                  component={Form.Input}
                  fluid
                  placeholder="Šalis"
                />
                <Field
                  name="url"
                  component={Form.Input}
                  placeholder="Svetainė"
                />
                <Field
                  name="address"
                  component={Form.Input}
                  placeholder="Adresas"
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

AddCompanyForm = connect(
  null,
  { addCompany },
)(AddCompanyForm);

export default reduxForm({
  form: 'addCompany',
})(AddCompanyForm);
