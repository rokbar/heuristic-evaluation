import React, {Component} from 'react';

class UsersCellRenderer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {value: {hasFoundProblem, value}} = this.props;
    return <div>
      {hasFoundProblem ? <p>x</p> : <p> </p>}
      <p>{value}</p>
    </div>;
  }
}

export default UsersCellRenderer;
