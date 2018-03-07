import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm} from 'redux-form';
import { map } from 'lodash';
import {
  Button,
  Form,
  Header,
  Segment,
  Accordion,
  Checkbox,
  Icon,
} from 'semantic-ui-react';

import { startEvaluation } from 'actions/teams';

class StartEvaluationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedHeuristic: null,
    }
  }

  handleClick = (e, titleProps) => {
    const {index} = titleProps;
    const {checkedHeuristic} = this.state;
    const newIndex = checkedHeuristic === index ? -1 : index;

    this.setState({ checkedHeuristic: newIndex });
  };

  renderAccordionRow({ id, name, rules }) {
    const { checkedHeuristic } = this.state;
    return [
      <Accordion.Title active={checkedHeuristic === id} index={id} onClick={this.handleClick}>
        <Checkbox />
        <Icon name="dropdown" />
        {name}
      </Accordion.Title>,
      <Accordion.Content active={checkedHeuristic === id}>
        {map(rules, (item, key) => <p>{key + 1}. {item && item.description}</p>)}
      </Accordion.Content>
    ]
  }

  renderAccordionContent(heuristics) {
    return map(heuristics, item => {
      const { id, name, rules } = item;
      return this.renderAccordionRow({ id, name, rules });
    });
  }

  render() {
    const { handleSubmit, startEvaluation, heuristics }  = this.props;

    return [
      <Header as="h2" color="teal" textAlign="center">
        Pradėti vertinimą
      </Header>,
      <Form onSubmit={handleSubmit(startEvaluation)} size="large">
        <Segment stacked>
          <Header size='medium'>Vertinimo euristikos</Header>
          <Accordion styled style={{ textAlign: 'left' }}>
            {this.renderAccordionContent(heuristics)}
          </Accordion>
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
