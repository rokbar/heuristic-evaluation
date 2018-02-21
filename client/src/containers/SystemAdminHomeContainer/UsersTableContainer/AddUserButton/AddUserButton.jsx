import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon } from 'semantic-ui-react';

export default function AddUserButton({ pushHistory }) {
  return (
    <Button
      color="teal"
      floated="right"
      size="small"
      onClick={() => pushHistory('/systemadmin/users/add')}
    >
      <Icon name="add user" /> Pridėti vartotoją
    </Button>
  )
}