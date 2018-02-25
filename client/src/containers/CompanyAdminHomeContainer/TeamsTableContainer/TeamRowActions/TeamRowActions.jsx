import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon } from 'semantic-ui-react';

export default function TeamRowActions(props) {
  return (
    <Button.Group>
      <Link to={`/companyadmin/teams/edit/${props.teamId}`}>
        <Button>
          <Icon name="edit"/>
        </Button>
      </Link>
    </Button.Group>
  )
}
