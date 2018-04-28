import React from 'react';

import {Button, Icon} from 'semantic-ui-react';
import {teamState} from 'utils/enums'

export default function TeamFinishRatingButton({disabled, teamId, changeTeamState, finishRating}) {
  const handleClick = ({teamId, finishRating, changeTeamState}) => {
    finishRating({teamId})
      .then(response => {
        return changeTeamState(teamState.evaluationFinished);
      })
      .catch();
  };

  return (
    <Button
      disabled={disabled}
      color="teal"
      floated="right"
      size="small"
      onClick={() => handleClick({teamId, finishRating, changeTeamState})}
      className="TeamFinishRatingButton"
    >
      <Icon name="checkmark"/> Baigti vertinimą
    </Button>
  )
}
