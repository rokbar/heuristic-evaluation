import React from 'react';

import { Button, Icon } from 'semantic-ui-react';
import { teamState } from 'utils/enums'

export default function SubmitGeneralizedProblemsButton({ teamId, changeTeamState, finishGeneralization }) {
  const handleClick = ({ teamId, finishGeneralization, changeTeamState }) => {
    finishGeneralization({ teamId })
      .then(response => {
        return changeTeamState(teamState.ratingProblems);
      })
      .catch();
  };

  return (
    <Button
      color="teal"
      floated="right"
      size="small"
      onClick={() => handleClick({ teamId, finishGeneralization, changeTeamState })}
      className="SubmitGeneralizedProblemsButton"
    >
      <Icon name="send" /> Pateikti apibendrintas problemas
    </Button>
  )
}
