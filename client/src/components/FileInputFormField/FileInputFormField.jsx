import React, { Component } from 'react';

class FileInputFormField extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    const { input: { onChange } } = this.props;
    onChange(e.target.files[0]);
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
