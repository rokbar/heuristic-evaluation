import React from 'react'

import { Button, Icon } from 'semantic-ui-react';

export default function TableActionsRenderer({ mergeProblems }) {
  return (
    <Button
      basic
      size="tiny"
      className="TableActionsRenderer"
      onClick={mergeProblems}
    >
      <Icon name="compress" /> Apjungti problemas
    </Button>
  )
}
