import React, { Component } from 'react';
import { map, toNumber, isArray, find } from 'lodash';
import PropTypes from 'prop-types';

import DataTable from 'components/DataTable';
import { Image, Icon, Label, Modal, Rating } from 'semantic-ui-react';
import SaveRatingsButton from './SaveRatingsButton';

const propTypes = {
  problems: PropTypes.array,
  rules: PropTypes.array,
  isRatingStarted: PropTypes.bool,
};

const defaultProps = {
  problems: [],
  rules: [],
  isRatingStarted: false,
};

class ProblemsRatingTable extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  handleClickSave = () => {

  };

  getTableHeaders() {
    return {
      description: 'Aprašymas',
      location: 'Lokacija',
      rules: 'Pažeistos euristikos',
      photo: 'Nuotrauka',
      rating: 'Įvertinimas',
      solution: 'Pasiūlymas taisymui',
    }
  }

  getRulesDescriptionsList(problemRules) {
    const {rules} = this.props;
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

  getTableData() {
    return this.props.problems.map(item => {
      const {id, description, location, photos, solution, rules} = item;
      return {
        description,
        location,
        rules: this.getRulesDescriptionsList(rules),
        photo: this.renderPhotoCell(photos),
        rating: this.renderRatingCell(),
        solution,
      };
    })
  }

  renderPhotoCell(photos) {
    return photos
      ? <Image.Group size="mini">
        {map(photos, (item, key) => <Modal key={key} trigger={<Image style={{cursor: 'pointer'}} src={item}/>}>
          <Image src={item}/>
        </Modal>)}
      </Image.Group>
      : <Image size="small">
        <Label content="Nuotrauka nerasta." icon="warning"/>
      </Image>
  }

  onMouseEnter = (e, data) => {
    console.log(e);
    console.log(data);
  };

  renderRatingCell() {
    return <Rating maxRating={4} onRate={this.onMouseEnter} />
  }

  renderTableActions() {
    return <SaveRatingsButton
      handleClickSave={this.handleClickSave}
    />;
  }

  render() {
    return [
      <DataTable
        actions={this.renderTableActions()}
        headers={this.getTableHeaders()}
        data={this.getTableData()}
      />
    ];
  }
}

ProblemsRatingTable.propTypes = propTypes;
ProblemsRatingTable.defaultProps = defaultProps;

export default ProblemsRatingTable;