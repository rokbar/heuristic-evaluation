import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

export default function FinishRatingButton({ onFinishRating, hasSavedRatings }) {
  return (
    <Button
      disabled={!hasSavedRatings}
      color="teal"
      floated="right"
      size="small"
      onClick={onFinishRating}
    >
      <Icon name="empty star" /> Pateikti įvertinimus
    </Button>
  )
}
