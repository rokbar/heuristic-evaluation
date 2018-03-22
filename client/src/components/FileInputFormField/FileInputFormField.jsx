import React, { Component } from 'react';
import { forEach, map } from 'lodash';

import { Image, Modal } from 'semantic-ui-react';

const initialState = {
  photos: [],
};

class FileInputFormField extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.state = initialState;
  }

  onChange(e) {
    const { input: { onChange } } = this.props;
    const files = e.target.files;
    const base64Files = [];

    forEach(files, (file => {
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.addEventListener('load', () => {
        base64Files.push({ uri: reader.result });
      }, false);
    }));

    this.setState({
      photos: base64Files.map(item => item.uri),
    });
    onChange([...base64Files]);
  }

  render() {
    const { input: { value } } = this.props;
    const { photos } = this.state;
    return [
      <input
        type="file"
        value={null}
        onChange={this.onChange}
        multiple
      />,
      <Image.Group size="small">
        {map(photos, (item) => <Modal trigger={<Image style={{ cursor: 'pointer' }} src={item} />}>
          <Image src={item} />
        </Modal>)}
      </Image.Group>
    ];
  }
}

export default FileInputFormField;
