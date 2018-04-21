import React from 'react';

import { Button, Icon } from 'semantic-ui-react';
import EditGeneralizedProblemFormModal from './EditGeneralizedProblemFormModal';

export default function ActionsCellRenderer(props) {
  const { data: { teamId, id }, rules, removeProblem, editProblem } = props;
  return (
    <Button.Group>
      <EditGeneralizedProblemFormModal
        rules={rules}
        teamId={teamId}
        problemId={id}
        editProblem={editProblem}
      />
      <Button onClick={() => removeProblem(id)}>
        <Icon name="trash" />
      </Button>
    </Button.Group>
  )
}
