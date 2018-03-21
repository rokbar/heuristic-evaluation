import React, { Component } from 'react';
import { Form } from 'semantic-ui-react';

class CheckboxFormField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: this.props.isCheckedBefore,
      value: props.input.value,
    };
    !this.props.isCheckedBefore && this.props.input.onChange(false); // hacks, to reset FieldArray form component values
  }

  render() {
    const { checked, value } = this.state;

    return <Form.Checkbox
      style={{ float: 'left' }}
      checked={checked}
      defaultChecked={false}
      value={checked && value}
      onClick={(e) => this.setState({ checked: !checked })}
      onChange={(e) => this.props.input.onChange(!checked && value)}
      label={this.props.label}
    />
  }
}

export default CheckboxFormField;
