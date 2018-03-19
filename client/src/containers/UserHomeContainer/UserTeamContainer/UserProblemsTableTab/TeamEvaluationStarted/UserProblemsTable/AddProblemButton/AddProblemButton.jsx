import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

export default function AddProblemButton() {
  return (
    <Button
      color="teal"
      floated="right"
      size="small"
      onClick={() => console.log('notimplemented')}
    >
      <Icon name="add" /> Pridėti problemą
    </Button>
  )
}