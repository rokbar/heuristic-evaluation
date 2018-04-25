import React from 'react';

import { Message, Icon } from 'semantic-ui-react';

export default function RatingFinished(props) {
  return (
    <Message info icon>
      <Icon name="info" />
      <Message.Content>
        <Message.Header>Vyksta problemų įvertinimas.</Message.Header>
        <p>Ne visi komandos nariai yra pateikę prolemų aktualumo įvertinimus. Visiems pateikus įvertinimus, matysite galutinį problemų sąrašą su įverčių vidurkiais.</p>
      </Message.Content>
    </Message>
  )
}
