import React from 'react';
import { map } from 'lodash';
import { List, Label, Grid, Icon, Header } from 'semantic-ui-react';

import { evaluatorTeamState } from 'utils/enums';

// TODO - duplice EvaluatorTeamMembersList, refactor
export default function LeaderRating(props) {
  const renderListRows = (props) => {
    const { teamUsers, leaderId } = props;
    return map(teamUsers, (user, key) => (
      <List.Item key={key}>
        <List.Icon name='user circle' size='large' verticalAlign='middle' />
        <List.Content>
          <List.Header style={{textAlign: 'left'}}>{user.name}</List.Header>
          <List.Description>
            {user.email}
            {user.id === leaderId && <Label color="yellow" horizontal>Leader</Label>}
            {user.state === evaluatorTeamState.evaluationFinished && <Icon name="checkmark" color="green" />}
          </List.Description>
        </List.Content>
      </List.Item>
    ))
  };

  return (
    <Grid
      textAlign="center"
      style={{height: "100%"}}
      verticalAlign="middle"
    >
      <Grid.Column style={{maxWidth: 450}}>
        <Header size='medium'>Vertintojai</Header>
        <List celled>
          {renderListRows(props)}
        </List>
      </Grid.Column>
    </Grid>
  )
}
