import React, { Component } from 'react';
import { map } from 'lodash';

import { Image, Modal, Label } from 'semantic-ui-react';

// TODO - duplicate component, refactor
class PhotoCellRenderer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { value} = this.props;
    return value
      ? <Image.Group size="mini">
        {map(value, (item, key) => <Modal key={key} trigger={<Image style={{ cursor: 'pointer' }} src={item} />}>
          <Image src={item} />
        </Modal>)}
      </Image.Group>
      : <Image size="small">
        <Label size="tiny" content="Nuotrauka nerasta." icon="warning" />
      </Image>
  }
}

export default PhotoCellRenderer;
