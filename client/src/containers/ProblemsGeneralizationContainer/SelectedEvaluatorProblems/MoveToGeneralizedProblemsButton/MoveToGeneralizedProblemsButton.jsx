import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react';

const propTypes = {
  checkedProblems: PropTypes.array,
  handleMoveProblemsClick: PropTypes.func,
};

const defaultProps = {
  checkedProblems: [],
  handleMoveProblemsClick: null,
};

function MoveToGeneralizedProblemsButton({ checkedProblems, handleMoveProblemsClick }) {
  return (
    <Button
      color="teal"
      floated="right"
      size="small"
      disabled={!checkedProblems.length || !checkedProblems}
      onClick={handleMoveProblemsClick}
    >
      <Icon name="long arrow left" /> Perkelti apibendrinimui
    </Button>
  )
}

MoveToGeneralizedProblemsButton.propTypes = propTypes;
MoveToGeneralizedProblemsButton.defaultProps = defaultProps;

export default MoveToGeneralizedProblemsButton;
