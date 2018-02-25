import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

export default function AddTeamButton({ pushHistory }) {
  return (
    <Button
      color="teal"
      floated="right"
      size="small"
      onClick={() => pushHistory('/companyadmin/teams/add')}
    >
      <Icon name="group" /> Pridėti komandą
    </Button>
  )
}