import React, { Component } from 'react';
import { connect } from 'react-redux';

import {Button, Icon} from 'semantic-ui-react';
import getReportMarkup from './ReportMarkup';

class LeaderGenerateReportButton extends Component {
  constructor(props) {
    super(props);
    this.state = { reportMarkup : null };
  }

  handleClick = () => {
    const { problems, heuristic } = this.props;
    this.setState({ reportMarkup: getReportMarkup({problems, heuristic}) })
  };

  render() {
    const { disabled, teamId } = this.props;

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

function mapStateToProps(state) {
  return {
    heuristic: state.heuristics.team[0],
  }
}

export default connect(
  mapStateToProps,
)(LeaderGenerateReportButton);
