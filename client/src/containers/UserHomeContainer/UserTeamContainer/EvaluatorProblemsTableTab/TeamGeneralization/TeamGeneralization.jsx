import React from 'react';

import { Message, Icon } from 'semantic-ui-react';

export default function LeaderEvaluationNotFinished(props) {
  return (
    <Message info icon>
      <Icon name="info" />
      <Message.Content>
        <Message.Header>Vyksta problemų apibendrinimas.</Message.Header>
        <p>Komandos lyderis sudarinėja bendrą problemų sąrašą. Problemų vertinimas prasidės lyderiui pateikus apibendrintą visų problemų sąrašą.</p>
      </Message.Content>
    </Message>
  )
}
