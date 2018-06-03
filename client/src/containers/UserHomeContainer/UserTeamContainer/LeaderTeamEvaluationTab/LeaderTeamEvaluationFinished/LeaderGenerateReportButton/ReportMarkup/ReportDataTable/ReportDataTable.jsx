import React, { Component } from 'react';
import { map, toString, reduce, filter, keyBy } from 'lodash';

import DataTable from 'components/DataTable';

class ReportDataTable extends Component {
  getTableHeaders() {
    const userRatingsColDefs = this.getUsersRatingsColDefs();
    const usersIdsMappedToHeaderNames = keyBy(userRatingsColDefs, ({field}) => toString(field));
    const objectKeys = Object.getOwnPropertyNames(usersIdsMappedToHeaderNames);
    return {
      description: 'Aprašymas',
      rules: 'Pažeistos euristikos',
      location: 'Lokacija',
      userRatings: {
        headerName: 'Aktualumo įvertis',
        children: userRatingsColDefs,
      },
      ...usersIdsMappedToHeaderNames,
      solution: 'Pasiūlymas taisymui',
      dataOrder: ['description', 'rules', 'location', ...objectKeys, 'solution'],
    }
  }

  getUsersRatingsColDefs = () => {
    const {teamUsers} = this.props;

    const colDefs = reduce(teamUsers, (result, user) => {
      const {id, name, surname} = user;
      const evaluatorInitials = `${name.charAt(0)}${surname.charAt(0)}`;
      const existingUsersInResult = result && result.length && filter(result, ({field}) => {
        return field === id;
      });
      const evaluatorInitialToSet = existingUsersInResult && existingUsersInResult.length ? `${evaluatorInitials}${existingUsersInResult}` : evaluatorInitials;

      result.push({
        headerName: evaluatorInitialToSet.toUpperCase(),
        field: toString(id),
        isChildHeader: true,
      });

      return result;
    }, []);

    return colDefs || [];
  };

  renderPhotos() {
    const { photos } = this.props;
    return map(photos, (item) => {
      const { url, width, height, number } = item;
      return <div className="images">
        <img src={url} width={width} height={height} />
        <div>{number} pav.</div>
        <br />
      </div>;
    });
  }

  render() {
    return [
      <DataTable
        hasGroupedHeaders
        headers={this.getTableHeaders()}
        data={this.props.problems}
      />,
      this.renderPhotos(),
    ];
  }
}

export default ReportDataTable;
