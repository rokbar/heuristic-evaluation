import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon } from 'semantic-ui-react';

export default function UserRowActions(props) {
  return (
    <Button.Group>
      <Link to={`/systemadmin/users/edit/${props.userId}`}>
        <Button>
          <Icon name="edit"/>
        </Button>
      </Link>
      <Button onClick={() => props.removeUser(props.userId)}>
        <Icon name="trash" />
      </Button>
    </Button.Group>
  )
}
