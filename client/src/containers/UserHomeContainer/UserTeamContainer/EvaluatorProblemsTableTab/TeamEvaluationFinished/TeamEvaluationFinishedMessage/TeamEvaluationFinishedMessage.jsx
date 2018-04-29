import React from 'react';

import { Message, Icon } from 'semantic-ui-react';

export default function TeamEvaluationFinishedMessage(props) {
  return (
    <Message positive icon>
      <Icon name="flag checkered" />
      <Message.Content>
        <Message.Header>Vertinimas yra pabaigtas.</Message.Header>
        <p>Euristinis vertinimas yra pabaigtas. Komandos lyderis gali generuoti problemų sąrašo dokumentą.</p>
      </Message.Content>
    </Message>
  )
}
