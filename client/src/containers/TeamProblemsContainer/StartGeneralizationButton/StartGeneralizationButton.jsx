import React from 'react';

import { Button, Icon } from 'semantic-ui-react';
import { teamState } from 'utils/enums'

export default function StartGeneralizationButton({ startGeneralization, changeTeamState,  teamId }) {
  const handleClick = ({ teamId, startGeneralization, changeTeamState }) => {
    startGeneralization({ teamId })
      .then(response => {
        return changeTeamState(teamState.generalization);
      })
      .catch();
  };

  return (
    <Button
      floated="right"
      positive
      onClick={() => handleClick({ teamId, startGeneralization, changeTeamState })}
    >
      <Icon name="clone" /> Problemų apibendrinimas
    </Button>
  )
}