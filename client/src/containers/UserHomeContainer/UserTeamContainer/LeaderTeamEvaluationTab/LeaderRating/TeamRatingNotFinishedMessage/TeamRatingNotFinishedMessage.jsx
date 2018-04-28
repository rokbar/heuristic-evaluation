import React from 'react';

import { Message, Icon } from 'semantic-ui-react';

export default function TeamRatingNotFinishedMessage(props) {
  return (
    <Message info icon>
      <Icon name="info" />
      <Message.Content>
        <Message.Header>Problemų aktualumo įvertinimas.</Message.Header>
        <p>Visiems komandos vertintojams pateikus problemų aktualumo įverčius, galėsite užbaigti vertinimą ir matyti redaguojamą galutinį problemų sąrašą.</p>
      </Message.Content>
    </Message>
  )
}
