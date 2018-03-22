import React, { Component } from 'react';

const reader = new FileReader();

class FileInputFormField extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    const { input: { onChange } } = this.props;
    const file = e.target.files[0];
    reader.readAsDataURL(file);

    reader.addEventListener('load', function () {
      onChange({ uri: reader.result });
    }, false);
  }

  render() {
    const { input: { value } } = this.props;
    return <input
      type="file"
      value={null}
      onChange={this.onChange}
    />
  }
}

export default FileInputFormField;
