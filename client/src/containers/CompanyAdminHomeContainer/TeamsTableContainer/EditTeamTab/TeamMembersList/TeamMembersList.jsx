import React from 'react';
import { map } from 'lodash';
import { List, Button, Icon } from 'semantic-ui-react';

export default function TeamMembersList(props) {
  const renderListRows = (props) => {
    const { teamUsers, teamId, removeUserFromTeam } = props;
    return map(teamUsers, (user, key) => (
      <List.Item key={key}>
        <List.Content floated="right">
          <Button onClick={() => removeUserFromTeam({ userId: user.id, teamId })}>
            <Icon name="trash" />
          </Button>
        </List.Content>
        <List.Icon name='user circle' size='large' verticalAlign='middle' />
        <List.Content>
          <List.Header style={{textAlign: 'left'}}>{user.name}</List.Header>
          <List.Description>{user.email}</List.Description>
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
