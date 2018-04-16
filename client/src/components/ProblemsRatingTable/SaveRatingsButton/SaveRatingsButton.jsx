import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

export default function SaveRatingsButton({ handleClickSave }) {
  return (
    <Button
      color="teal"
      floated="right"
      size="small"
      onClick={handleClickSave}
    >
      <Icon name="save" /> Išsaugoti
    </Button>
  )
}
