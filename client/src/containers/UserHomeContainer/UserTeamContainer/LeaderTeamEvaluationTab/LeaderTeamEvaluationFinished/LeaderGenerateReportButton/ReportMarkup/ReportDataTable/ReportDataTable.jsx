import React, { Component } from 'react';
import { find, isArray, map, toNumber } from 'lodash';

import DataTable from 'components/DataTable';

class ReportDataTable extends Component {
  getTableHeaders() {
    return {
      description: 'Aprašymas',
      rules: 'Pažeistos euristikos',
      location: 'Lokacija',
      photo: 'Nuotrauka',
      solution: 'Pasiūlymas taisymui',
    }
  }

  render() {
    return [
      <DataTable
        headers={this.getTableHeaders()}
        data={this.props.problems}
      />,
    ];
  }
}

export default ReportDataTable;
