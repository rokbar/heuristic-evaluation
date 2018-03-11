import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import {
  Form,
  Header,
  Segment,
  Button,
} from 'semantic-ui-react';

import { startEvaluation } from 'actions/teams';
import HeuristicSelect from './HeuristicSelect';
import PlanList from './PlanList';

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

    this.setState({ checkedHeuristic: newIndex });
  };

  render() {
    const { handleSubmit, startEvaluation, heuristics } = this.props;
    const { checkedHeuristic } = this.state;

    return [
      <Header as="h2" color="teal" textAlign="center">
        Pradėti vertinimą
      </Header>,
      <Form onSubmit={handleSubmit(startEvaluation)} size="large">
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
  { startEvaluation },
)(StartEvaluationForm);

export default reduxForm({
  form: 'startEvaluation',
})(StartEvaluationForm);
