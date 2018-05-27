import React, { Component } from 'react';
import { map, reduce, toNumber, isArray, find, uniqBy } from 'lodash';
import PropTypes from 'prop-types';

import DataTable from 'components/DataTable';
import { Image, Label, Modal, Rating } from 'semantic-ui-react';
import StartRatingButton from './StartRatingButton';
import SaveRatingsButton from './SaveRatingsButton';
import FinishRatingButton from './FinishRatingButton';

import { getUserRatingsByTeam, createOrUpdateRatings } from 'actions/ratings';

const propTypes = {
  startRatingProblems: PropTypes.func,
  finishRatingProblems: PropTypes.func,
  problems: PropTypes.array,
  rules: PropTypes.array,
  hasRatingStarted: PropTypes.bool,
  hasEvaluatorFinishedRating: PropTypes.bool,
};

const defaultProps = {
  onStartRating: null,
  onFinishRating: null,
  problems: [],
  rules: [],
  hasRatingStarted: false,
  hasEvaluatorFinishedRating: false,
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

    const existingRating = find(this.state.ratings, (item) => item.problemId === problemId);
    let newRating = {};

    if (existingRating) {
      const {id, problemId, evaluatorId} = existingRating;
      newRating = { id, problemId, value: rating, evaluatorId };
    } else {
      newRating = { problemId, value: rating };
    }

    this.setState(prevState => ({
      updatedRatings: uniqBy(
        [{ ...newRating }, ...prevState.updatedRatings],
        'problemId',
      )
    }));
  };

  handleClickSave = () => {
    createOrUpdateRatings({ ratings: this.state.updatedRatings })
      .then(response => {
        // response is not a array of inserted ratings
        return response && response.length
          ? getUserRatingsByTeam({ teamId: this.props.teamId })
          : 0;
      })
      .then(ratings => {
        return this.setState({
          ratings: ratings && ratings.length ? ratings : [],
          updatedRatings: []
        });
      })
      .catch()
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

    return mappedRules && mappedRules.join('\n');
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
    const { hasRatingStarted, hasEvaluatorFinishedRating } = this.props;

    return <Rating
      maxRating={4}
      disabled={!hasRatingStarted || hasEvaluatorFinishedRating}
      clearable
      defaultRating={value}
      problemId={problemId}
      onRate={this.handleRatingClick}
    />
  }

  renderTableActions() {
    const { hasRatingStarted, hasEvaluatorFinishedRating } = this.props;

    return hasRatingStarted && !hasEvaluatorFinishedRating && <SaveRatingsButton
      handleClickSave={this.handleClickSave}
    />;
  }

  render() {
    const { hasRatingStarted, hasEvaluatorFinishedRating, startRatingProblems, finishRatingProblems } = this.props;
    return [
      !hasEvaluatorFinishedRating
        ? !hasRatingStarted
          ? <StartRatingButton
            onStartRating={startRatingProblems}
          />
          : <FinishRatingButton
            onFinishRating={finishRatingProblems}
            hasSavedRatings={!this.state.updatedRatings.length} // do not let submit ratings if there are unsaved data
          />
        : null,
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
