import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

export default function AddCompanyButton({ pushHistory }) {
  return (
    <Button
      color="teal"
      floated="right"
      size="small"
      onClick={() => pushHistory('/systemadmin/companies/add')}
    >
      <Icon name="briefcase" /> Pridėti įmonę
    </Button>
  )
}