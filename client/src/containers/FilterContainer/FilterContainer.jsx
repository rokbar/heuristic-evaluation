import React, { Component } from 'react';

import { Icon, Segment } from 'semantic-ui-react';

const initialState = {
  visible: false,
};

class FilterContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState,
    }
  }

  toggleVisibility = () => this.setState({ visible: !this.state.visible })

  // css styles are written in Layout component
  render() {
    const { visible } = this.state;
    return [
      <Icon
        key="FilterToggleButton"
        className="ToggleButton"
        name={visible ? 'chevron left': 'chevron right'}
        onClick={this.toggleVisibility}
        size="huge"
        link
        fitted
      />,
      visible
        ? <Segment
          className="FilterMenu"
          key="FilterMenu"
        >
          Not Implemented
        </Segment>
        : null
    ];
  }
}

export default FilterContainer;
