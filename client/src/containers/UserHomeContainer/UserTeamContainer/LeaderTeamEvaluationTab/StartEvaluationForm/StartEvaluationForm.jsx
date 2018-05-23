import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, change } from 'redux-form';
import {
  Form,
  Header,
  Segment,
  Button,
} from 'semantic-ui-react';

import { startEvaluation } from 'actions/teams';
import HeuristicSelect from './HeuristicSelect';
import PlanList from './PlanList';

import { teamState } from 'utils/enums';

class StartEvaluationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedHeuristic: null,
    }
  }

  componentDidMount() {
    this.props.initialize({ teamId: this.props.teamId });
  }

  handleHeuristicClick = (e, titleProps) => {
    const {index} = titleProps;
    const {checkedHeuristic} = this.state;
    const newIndex = checkedHeuristic === index ? -1 : index;
    this.props.change('startEvaluation', 'heuristicId', newIndex);

    this.setState({ checkedHeuristic: newIndex });
  };

  onFormSubmit = (data) => {
    const { startEvaluation, changeTeamState } = this.props;
    startEvaluation({ ...data })
      .then((response) => {
        return changeTeamState(teamState.evaluationStarted);
      })
      .catch();
  };

  render() {
    const { handleSubmit, heuristics } = this.props;
    const { checkedHeuristic } = this.state;

    return [
      <Header as="h2" color="teal" textAlign="center">
        Pradėti vertinimą
      </Header>,
      <Form onSubmit={handleSubmit(this.onFormSubmit)} size="large">
        <Segment>
          <HeuristicSelect
            heuristics={heuristics}
            checkedHeuristic={checkedHeuristic}
            handleHeuristicClick={this.handleHeuristicClick}
          />
          <PlanList />
          <Button
            type="submit"
            color="teal"
            fluid
            size="large"
          >
            Pradėti
          </Button>
        </Segment>
      </Form>
    ]
  }
}

StartEvaluationForm = connect(
  null,
  { startEvaluation, change },
)(StartEvaluationForm);

export default reduxForm({
  form: 'startEvaluation',
})(StartEvaluationForm);
