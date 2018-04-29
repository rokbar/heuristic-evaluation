import React from 'react';

import {Button, Icon} from 'semantic-ui-react';

export default function LeaderGenerateReportButton({disabled, teamId}) {
  return (
    <Button
      disabled={disabled}
      color="teal"
      floated="right"
      size="small"
      onClick={() => console.log('clicked')}
      className="LeaderGenerateReportButton"
    >
      <Icon name="file word outline"/> Generuoti dokumentą
    </Button>
  )
}
