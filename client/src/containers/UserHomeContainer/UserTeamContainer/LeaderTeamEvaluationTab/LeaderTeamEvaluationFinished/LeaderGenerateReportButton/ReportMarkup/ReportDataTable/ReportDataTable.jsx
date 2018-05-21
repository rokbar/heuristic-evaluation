import React, { Component } from 'react';
import { map } from 'lodash';


import DataTable from 'components/DataTable';

class ReportDataTable extends Component {
  getTableHeaders() {
    return {
      description: 'Aprašymas',
      rules: 'Pažeistos euristikos',
      location: 'Lokacija',
      solution: 'Pasiūlymas taisymui',
    }
  }

  renderPhotos() {
    const { photos } = this.props;
    return map(photos, (item) => {
      const { url, width, height, number } = item;
      return <div>
        <img src={url} width={width} height={height} />
        {number} pav.
      </div>;
    });
  }

  render() {
    return [
      <DataTable
        headers={this.getTableHeaders()}
        data={this.props.problems}
      />,
      this.renderPhotos(),
    ];
  }
}

export default ReportDataTable;
