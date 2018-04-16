import React, { Component } from 'react';
import { map, reduce, toNumber, isArray, find, uniqBy } from 'lodash';
import PropTypes from 'prop-types';

import DataTable from 'components/DataTable';
import { Image, Label, Modal, Rating } from 'semantic-ui-react';
import SaveRatingsButton from './SaveRatingsButton';

import { getUserRatingsByTeam } from 'actions/ratings';

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
    this.state = {
      ratings: [],
      updatedRatings: [],
    }
  }

  componentDidMount() {
    const { teamId } = this.props;

    getUserRatingsByTeam({ teamId })
      .then(response => {
        this.setState({ ratings: response && response.length ? response : [] });
      })
      .catch();
  }

  componentWillReceiveProps(nextProps) {
    const { problems } = nextProps;

    if (problems && problems.length) {
      const { ratings } = this.state;
      const updatedRatings = this.getInitialRatingsState({ problems, ratings });

      this.setState(prevState => ({
        updatedRatings: uniqBy(
          [...updatedRatings, ...prevState.updatedRatings], // prevState.updatedRatings must be after
          'problemId',
        ),
      }));
    }
  }

  handleRatingClick = (e, data) => {
    const { rating, problemId } = data;
    const updatedRatings = map(this.state.updatedRatings, (item) => (
      item.problemId === problemId ? { ...item, value: rating } : { ...item }
    ));

    this.setState({ updatedRatings });
  };

  handleClickSave = () => {

  };

  getInitialRatingsState({ problems, ratings }) {
    // track which problems weren't rated yet
    // if problems are left with 0 rating, ratings will be inserted into DB either way (with 0 value)
    return reduce(problems, (updatedRatings, item) => {
      const rating = find(ratings, (o) => o.problemId === item.id);

      if (!rating) updatedRatings.push({ problemId: item.id, value: 0 });

      return updatedRatings;
    }, []);
  }

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
    const { ratings } = this.state;

    return this.props.problems.map(item => {
      const {id, description, location, photos, solution, rules} = item;
      const rating = find(ratings, (o) => o.problemId === id);

      return {
        description,
        location,
        rules: this.getRulesDescriptionsList(rules),
        photo: this.renderPhotoCell(photos),
        rating: this.renderRatingCell({ problemId: id, value: rating ? rating.value : 0 }),
        solution,
      };
    });
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

  renderRatingCell({ problemId = null, value = 0 }) {
    const { isRatingStarted } = this.props;

    return <Rating
      maxRating={4}
      disabled={isRatingStarted}
      clearable
      defaultRating={value}
      problemId={problemId}
      onRate={this.handleRatingClick}
    />
  }

  renderTableActions() {
    const { isRatingStarted } = this.props;

    return isRatingStarted && <SaveRatingsButton
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