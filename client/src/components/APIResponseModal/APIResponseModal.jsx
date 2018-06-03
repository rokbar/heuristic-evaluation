import React, {Component} from 'react';
import {connect} from 'react-redux';

import {Modal, Header, Button} from 'semantic-ui-react';

import {closeAPIResponseModal} from 'actions/apiResponse';

class APIResponseModal extends Component {
  showHeader = (type) => {
    switch (type) {
      case 'error':
        return <Header icon="exclamation" content="Įvyko klaida"/>;
      case 'info':
        return <Header icon="info" content='Informacija'/>;
      case 'succes':
        return <Header icon="checkmark" content='Operacija sėkmingai atlikta'/>;
    }
  };

  render() {
    const {apiResponseModal: {isOpen, type, message}, closeAPIResponseModal} = this.props;
    return <Modal open={isOpen} size="tiny">
      {this.showHeader(type)}
      <Modal.Content>
        <p>{message}</p>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={closeAPIResponseModal} positive>Uždaryti</Button>
      </Modal.Actions>
    </Modal>
  }
}

const mapStateToProps = (state) => ({
  apiResponseModal: state.apiResponse,
});

export default connect(mapStateToProps, {closeAPIResponseModal})(APIResponseModal);