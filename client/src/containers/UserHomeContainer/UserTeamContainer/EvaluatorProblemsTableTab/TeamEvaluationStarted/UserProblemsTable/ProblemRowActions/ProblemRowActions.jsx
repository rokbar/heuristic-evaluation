import React from 'react';

import { Button, Icon } from 'semantic-ui-react';
import EditProblemFormModal from '../EditProblemFormModal';

export default function ProblemRowActions(props) {
  return (
    <Button.Group>
      <EditProblemFormModal
        rules={props.rules}
        teamId={props.teamId}
        problemId={props.problemId}
      />
      <Button onClick={() => props.removeProblem(props.problemId)}>
        <Icon name="trash" />
      </Button>
    </Button.Group>
  )
}
