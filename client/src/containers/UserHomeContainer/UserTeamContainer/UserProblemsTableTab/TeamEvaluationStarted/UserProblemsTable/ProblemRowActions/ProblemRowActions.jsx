import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon } from 'semantic-ui-react';

export default function ProblemRowActions(props) {
  return (
    <Button.Group>
        <Button>
          <Icon name="edit"/>
        </Button>
      <Button onClick={() => console.log('notimplemented')}>
        <Icon name="trash" />
      </Button>
    </Button.Group>
  )
}
