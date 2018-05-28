import React, { Component } from 'react';

import { Button, Icon, Modal, Header } from 'semantic-ui-react';
import EditProblemForm from '../EditProblemForm';

const initialState = {
  modalOpen: false,
};

class EditProblemFormModal extends Component {
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
    const { rules, teamId, problemId } = this.props;
    return (
      <Modal
        trigger={this.renderEditProblemButton()}
        open={this.state.modalOpen}
        onClose={this.handleClose}
        size="tiny"
        closeIcon
      >
        <Header content="Redaguoti problemą" />
        <Modal.Content>
          <EditProblemForm
            rules={rules}
            teamId={teamId}
            problemId={problemId}
          />
        </Modal.Content>
      </Modal>
    )
  }
}

export default EditProblemFormModal;
