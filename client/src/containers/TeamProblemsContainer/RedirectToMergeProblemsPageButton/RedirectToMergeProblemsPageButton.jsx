import React from 'react';

import { Button, Icon } from 'semantic-ui-react';

export default function RedirectToMergeProblemsPageButton({ pushHistory }) {
  return (
    <Button
      color="teal"
      floated="right"
      size="small"
      onClick={() => pushHistory('/companyadmin/teams/add')}
    >
      <Icon name="compress" /> Apjungti problemas
    </Button>
  )
}
