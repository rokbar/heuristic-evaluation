import React, { Component } from 'react';
import { forEach } from 'lodash';

class FileInputFormField extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
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

    onChange([...base64Files]);
  }

  render() {
    const { input: { value } } = this.props;
    return <input
      type="file"
      value={null}
      onChange={this.onChange}
      multiple
    />
  }
}

export default FileInputFormField;
