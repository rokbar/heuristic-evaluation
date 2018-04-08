import React from 'react';
import { map } from 'lodash';
import { List, Label, Button, Icon } from 'semantic-ui-react';

export default function EvaluatorTeamMembersList(props) {
  const renderListRows = (props) => {
    const { teamUsers, leaderId } = props;
    return map(teamUsers, (user) => (
      <List.Item>
        <List.Icon name='user circle' size='large' verticalAlign='middle' />
        <List.Content>
          <List.Header style={{textAlign: 'left'}}>{user.name}</List.Header>
          <List.Description>
            {user.email}
            {user.id === leaderId && <Label color="yellow" horizontal>Leader</Label>}
          </List.Description>
        </List.Content>
      </List.Item>
    ))
  };

  return (
    <List celled>
      {renderListRows(props)}
    </List>
  )
}
