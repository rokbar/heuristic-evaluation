import React, { Component } from 'react';
import { find, isArray, map, toNumber, forEach } from 'lodash';

import DataTable from 'components/DataTable';
import { Label } from 'semantic-ui-react';

class ReportDataTable extends Component {
  constructor(props) {
    super(props);
    this.renderPhotoCell = this.renderPhotoCell.bind(this);
  }

  getRulesDescriptionsList(problemRules) {
    const { rules } = this.props.heuristic;
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
      rules: 'Pažeistos euristikos',
      location: 'Lokacija',
      photo: 'Nuotrauka',
      solution: 'Pasiūlymas taisymui',
    }
  }

  getTableData() {
    return this.props.problems.map(async (item) => {
      const { description, location, photos, solution, rules } = item;
      const renderedPhoto = await this.renderPhotoCell(photos);
      return {
        description,
        rules: this.getRulesDescriptionsList(rules),
        location,
        photo: renderedPhoto,
        solution,
      };
    })
  }

  renderImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      let width = 45;
      let height = 0;
      img.onload = function() {
        height = this.height / (this.width / 45);
        resolve({ width, height });
      };
      img.src = src;
    });
  }

  renderPhotoCell(photos) {
    let promises = [];


    forEach(photos, (photo => {
      promises.push(
        new Promise((resolve, reject) => <div>{map(photos, (item, key) => {
          return this.renderImage(item)
            .then(({ width, height }) => {
              return resolve(<img height={height} width={width} src={item}/>);
            })
        })}</div>),
      )
      // : <Label content="Nuotrauka nerasta." icon="warning"/>;
    }));

    return Promise.all(promises)
      .then(photos => photos)
      .catch(err => console.log(err));
  }

  render() {
    return [
      <DataTable
        headers={this.getTableHeaders()}
        data={this.getTableData()}
      />,
    ];
  }
}

export default ReportDataTable;
