import React, {Component} from 'react';
import PropTypes from 'react';
import { connect } from 'react-redux';
import {find, map, isArray, toNumber} from 'lodash';

const propTypes = {
  heuristic: PropTypes.object,
};

const defaultProps = {
  heuristic: { rules: [] },
};

// TODO - duplicate component, refactor
class RulesCellRenderer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {rules} = this.props.heuristic;
    const {value} = this.props; // heuristic rule ids
    let mappedRules;

    if (isArray(value)) {
      mappedRules = value && map(value, (id) => {
        const foundRule = find(rules, (x) => x.id === toNumber(id));
        return foundRule ? `${foundRule.listNumber}. ${foundRule.description}` : null;
      });
    } else {
      mappedRules = value && map(value.split(','), (id) => {
        const foundRule = find(rules, (x) => x.id === toNumber(id));
        return foundRule ? `${foundRule.listNumber}. ${foundRule.description}` : null;
      });
    }

    return <div className="cell-wrap-text">{mappedRules && mappedRules.join(' ')}</div>;
  }
}

RulesCellRenderer.propTypes = propTypes;
RulesCellRenderer.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    heuristic: state.heuristics.team[0],
  }
}

export default connect(mapStateToProps)(RulesCellRenderer);
