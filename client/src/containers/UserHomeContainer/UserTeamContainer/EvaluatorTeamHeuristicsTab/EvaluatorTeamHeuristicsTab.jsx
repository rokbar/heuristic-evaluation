import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { map } from 'lodash';

import { Header, List, Icon, Segment } from 'semantic-ui-react';

import { getHeuristicsRules } from 'actions/heuristics';

const propTypes = {
  heuristicId: PropTypes.number,
  heuristic: PropTypes.arrayOf({}),
};

const defaultProps = {
  heuristicId: null,
  heuristic: [],
};

class EvaluatorTeamHeuristicsTab extends Component {
  componentDidMount() {
    const { heuristicId } = this.props;
    this.props.getHeuristicsRules({ heuristicId });
  }

  render() {
    const {heuristic: {rules}} = this.props;
    return [
      <Segment basic textAlign="center">
        <Header as="h2" textAlign="center" icon>
          <Icon name="ordered list" circular/>
          {rules && rules[0].heuristicName}
          <Header.Subheader>
            Euristikų rinkinys
          </Header.Subheader>
        </Header>
      </Segment>,
      <Segment basic textAlign="left">
        <List as="ol">
          {map(rules, (item) => <List.Item as="li">{item.description}</List.Item>)}
        </List>
      </Segment>
    ];
  }
}

EvaluatorTeamHeuristicsTab.propTypes = propTypes;
EvaluatorTeamHeuristicsTab.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    heuristic: state.heuristics[0],
  }
}

export default connect(mapStateToProps, { getHeuristicsRules })(EvaluatorTeamHeuristicsTab);