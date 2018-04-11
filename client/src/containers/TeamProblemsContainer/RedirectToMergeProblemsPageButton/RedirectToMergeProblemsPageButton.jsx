import React from 'react';

import { Button, Icon } from 'semantic-ui-react';

export default function RedirectToMergeProblemsPageButton({ pushHistory, teamId }) {
  return (
    <Button
      color="teal"
      floated="right"
      size="small"
      onClick={() => pushHistory(`/evaluator/teams/${teamId}/generalization`)}
    >
      <Icon name="compress" /> Apjungti problemas
    </Button>
  )
}
