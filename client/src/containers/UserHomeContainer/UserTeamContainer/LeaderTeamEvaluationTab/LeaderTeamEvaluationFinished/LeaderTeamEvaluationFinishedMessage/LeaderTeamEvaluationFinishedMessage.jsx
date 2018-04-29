import React from 'react';

import { Message, Icon } from 'semantic-ui-react';

import './LeaderTeamEvaluationFinishedMessage.css';

export default function LeaderTeamEvaluationFinishedMessage(props) {
  return (
    <Message positive icon className="LeaderTeamEvaluationFinishedMessage">
      <Icon name="flag checkered" />
      <Message.Content>
        <Message.Header>Euristinis vertinimas yra pabaigtas.</Message.Header>
        <p>Galite generuoti ir parsisiųsti problemų sąrašo dokumentą, keisti problemų eiliškumą, redaguoti detales. Dokumentą galite generuoti daug kartų.</p>
      </Message.Content>
    </Message>
  )
}
