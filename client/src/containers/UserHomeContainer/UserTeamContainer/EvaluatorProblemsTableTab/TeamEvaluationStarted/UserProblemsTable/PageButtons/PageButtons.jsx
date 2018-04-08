import React from 'react';

import { Button, Icon } from 'semantic-ui-react';

export function SubmitProblemsButton({ submitUserProblems }) {
  return (
    <Button
      positive
      onClick={submitUserProblems}
    >
      <Icon name="upload" /> Pateikti problemas
    </Button>
  )
}

export function CancelProblemsButton({ cancelUserProblems }) {
  return (
    <Button
      negative
      onClick={cancelUserProblems}
      size="tiny"
    >
      <Icon name="cancel" /> Atšaukti pateikimą
    </Button>
  )
}