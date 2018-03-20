import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon } from 'semantic-ui-react';

export default function ProblemRowActions(props) {
  return (
    <Button.Group>
        <Button>
          <Icon name="edit"/>
        </Button>
      <Button onClick={() => props.removeProblem(props.problemId)}>
        <Icon name="trash" />
      </Button>
    </Button.Group>
  )
}
