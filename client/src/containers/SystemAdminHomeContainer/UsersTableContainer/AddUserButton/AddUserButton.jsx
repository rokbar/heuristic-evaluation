import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

export default function AddUserButton(props) {
  return (
    <Button color="teal" floated="right" size="small">
      <Icon name="add user" /> Pridėti vartotoją
    </Button>
  )
}