import React, { Component } from 'react';

import {Button, Icon} from 'semantic-ui-react';
import getReportMarkup from './ReportMarkup';

class LeaderGenerateReportButton extends Component {
  constructor(props) {
    super(props);
    this.state = { reportMarkup : null };
  }

  handleClick = () => {
    this.setState({ reportMarkup: getReportMarkup() })
  };
S
  render() {
    const { disabled, teamId } = this.props;
    console.log(this.state.reportMarkup);
    return [
      <Button
        disabled={disabled}
        color="teal"
        floated="right"
        size="small"
        onClick={this.handleClick}
        className="LeaderGenerateReportButton"
      >
        <Icon name="file word outline"/> Generuoti dokumentą
      </Button>,
      this.state.reportMarkup && <a download="report.doc" href={'data:text/html,' + encodeURIComponent(this.state.reportMarkup)}>Parsisiųsti</a>,
    ];
  }
}

export default LeaderGenerateReportButton;
