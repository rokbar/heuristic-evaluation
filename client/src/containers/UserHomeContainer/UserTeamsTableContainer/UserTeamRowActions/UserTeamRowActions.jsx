import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon } from 'semantic-ui-react';

export default function UserTeamRowActions(props) {
  return (
    <Button.Group>
      <Link to={`/evaluator/teams/${props.teamId}`}>
        <Button>
          <Icon name="edit"/>
        </Button>
      </Link>
    </Button.Group>
  )
}
