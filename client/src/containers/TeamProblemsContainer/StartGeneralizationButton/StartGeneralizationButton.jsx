import React from 'react';

import { Button, Icon } from 'semantic-ui-react';

export default function StartGeneralizationButton({ startGeneralization }) {
  return (
    <Button
      floated="right"
      positive
      onClick={startGeneralization}
    >
      <Icon name="clone" /> Problemų apibendrinimas
    </Button>
  )
}