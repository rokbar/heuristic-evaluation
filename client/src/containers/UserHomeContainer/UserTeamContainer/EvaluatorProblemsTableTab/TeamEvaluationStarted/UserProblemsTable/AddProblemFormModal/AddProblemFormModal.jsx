import React, { Component } from 'react';

import { Button, Icon, Modal, Header } from 'semantic-ui-react';
import AddProblemForm from '../AddProblemForm';

const initialState = {
  modalOpen: false,
};

class AddProblemFormModal extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  handleOpen = () => this.setState({ modalOpen: true });

  handleClose = () => this.setState({ modalOpen: false });

  renderAddProblemButton() {
    return (
      <Button
        color="teal"
        floated="right"
        size="small"
        onClick={this.handleOpen}
      >
        <Icon name="add" /> Pridėti problemą
      </Button>
    )
  }

  render() {
    const { rules, teamId } = this.props;
    return (
      <Modal
        trigger={this.renderAddProblemButton()}
        open={this.state.modalOpen}
        onClose={this.handleClose}
        closeIcon
        size="tiny"
      >
        <Header content="Pridėti problemą" />
        <Modal.Content>
          <AddProblemForm
            rules={rules}
            teamId={teamId}
          />
        </Modal.Content>
      </Modal>
    )
  }
}

export default AddProblemFormModal;
