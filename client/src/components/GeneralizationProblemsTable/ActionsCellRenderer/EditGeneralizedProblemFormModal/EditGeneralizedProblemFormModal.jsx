import React, { Component } from 'react';

import { Button, Icon, Modal, Header } from 'semantic-ui-react';
import EditGeneralizedProblemForm from '../EditGeneralizedProblemForm';

const initialState = {
  modalOpen: false,
};

class EditGeneralizedProblemFormModal extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  handleOpen = () => this.setState({ modalOpen: true });

  handleClose = () => this.setState({ modalOpen: false });

  renderEditProblemButton() {
    return (
      <Button
        onClick={this.handleOpen}
      >
        <Icon name="edit" />
      </Button>
    )
  }

  render() {
    const { rules, teamId, problemId, editProblem } = this.props;
    return (
      <Modal
        trigger={this.renderEditProblemButton()}
        open={this.state.modalOpen}
        onClose={this.handleClose}
        closeIcon
      >
        <Header content="Redaguoti problemą" />
        <Modal.Content>
          <EditGeneralizedProblemForm
            rules={rules}
            teamId={teamId}
            problemId={problemId}
            editProblem={editProblem}
          />
        </Modal.Content>
      </Modal>
    )
  }
}

export default EditGeneralizedProblemFormModal;
