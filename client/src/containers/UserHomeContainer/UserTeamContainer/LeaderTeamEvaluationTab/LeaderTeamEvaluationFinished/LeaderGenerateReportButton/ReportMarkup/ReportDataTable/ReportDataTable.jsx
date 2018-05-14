import React, { Component } from 'react';
import { find, isArray, map, toNumber } from 'lodash';

import DataTable from 'components/DataTable';

class ReportDataTable extends Component {
  getRulesDescriptionsList(problemRules) {
    const {rules} = this.props.heuristic;
    let mappedRules;

    if (isArray(problemRules)) {
      mappedRules = problemRules && map(problemRules, (id) => {
          const foundRule = find(rules, (x) => x.id === toNumber(id));
          return foundRule ? `${foundRule.listNumber}. ${foundRule.description}` : null;
        });
    } else {
      mappedRules = problemRules && map(problemRules.split(','), (id) => {
          const foundRule = find(rules, (x) => x.id === toNumber(id));
          return foundRule ? `${foundRule.listNumber}. ${foundRule.description}` : null;
        });
    }

    return mappedRules && mappedRules.join(' ');
  }

  getTableHeaders() {
    return {
      description: 'Aprašymas',
      location: 'Lokacija',
      rules: 'Pažeistos euristikos',
      solution: 'Pasiūlymas taisymui',
    }
  }

  getTableData() {
    return this.props.problems.map(item => {
      const {description, location, solution, rules} = item;
      return {
        description,
        location,
        rules: this.getRulesDescriptionsList(rules),
        solution,
      };
    })
  }

  render() {
    return [
      <DataTable
        headers={this.getTableHeaders()}
        data={this.getTableData()}
      />
    ];
  }
}

export default ReportDataTable;
