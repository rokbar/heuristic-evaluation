import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

export default function StartRatingButton({ onStartRating }) {
  return (
    <Button
      color="teal"
      floated="right"
      size="small"
      onClick={onStartRating}
    >
      <Icon name="empty star" /> Pradėti įvertinimą
    </Button>
  )
}
