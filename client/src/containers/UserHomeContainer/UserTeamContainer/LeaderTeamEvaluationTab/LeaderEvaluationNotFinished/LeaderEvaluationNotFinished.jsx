import React from 'react';

import { Message, Icon } from 'semantic-ui-react';

export default function LeaderEvaluationNotFinished(props) {
  return (
    <Message warning icon>
      <Icon name="warning" />
      <Message.Content>
        <Message.Header>Jūs nesate pateikęs panaudojamumo problemų.</Message.Header>
        <p>Norėdami peržvelgti komandos problemas, turite pirmiausiai pateikti rastas panaudojamumo problemas.</p>
      </Message.Content>
    </Message>
  )
}