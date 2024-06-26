import React, { Component } from 'react';
import { Field } from 'redux-form';
import { map } from 'lodash';
import {
  Button,
  Header,
  Accordion,
  Radio,
  Icon,
} from 'semantic-ui-react';

import RadioFormField from 'components/RadioFormField';
import CustomHeuristicRow from './CustomHeuristicRow';
import './HeuristicSelect.css';

class HeuristicSelect extends Component {
  renderAddHeuristicRow() {
    const { checkedHeuristic, handleHeuristicClick } = this.props;

    return [
      <Accordion.Title active={checkedHeuristic === 'custom'} index={'custom'} onClick={handleHeuristicClick}>
        <Radio checked={checkedHeuristic === 'custom'}/>
        <Icon name="dropdown"/>
        Sukurti naujas euristikas
      </Accordion.Title>,
      <Accordion.Content active={checkedHeuristic === 'custom'}>
        <CustomHeuristicRow/>
      </Accordion.Content>
    ];
  }

  renderAccordionRow({ id, name, rules }) {
    const { checkedHeuristic, handleHeuristicClick } = this.props;
    return [
      <Accordion.Title
        className="HeuristicRow"
        active={checkedHeuristic === id}
        index={id}
        onClick={handleHeuristicClick}
      >
        <Field
          name="heuristicId"
          component={RadioFormField}
          checked={checkedHeuristic === id}
          type="radio"
          value={id}
        />
        <Icon name="dropdown" />
        {name}
      </Accordion.Title>,
      <Accordion.Content active={checkedHeuristic === id}>
        {map(rules, (item, key) => <p key={key}>{key + 1}. {item && item.description}</p>)}
      </Accordion.Content>
    ]
  }

  renderAccordionContent(heuristics) {
    const { checkedHeuristic, handleHeuristicClick } = this.props;

    const heuristicsAccordion = map(heuristics, item => {
      const { id, name, rules } = item;
      return this.renderAccordionRow({ id, name, rules });
    });

    if (checkedHeuristic === 'custom') {
      heuristicsAccordion.push(this.renderAddHeuristicRow());
    } else {
      heuristicsAccordion.push(
        <Button
          type="button"
          floated="right"
          positive
          onClick={(e) => handleHeuristicClick(e, {index: 'custom'})}
        >
          Įkelti naujas
        </Button>
      );
    }

    return heuristicsAccordion;
  }

  render() {
    const { heuristics } = this.props;

    return [
      <Header size='medium'>Vertinimo euristikos</Header>,
      <Accordion styled style={{ textAlign: 'left' }}>
        {this.renderAccordionContent(heuristics)}
      </Accordion>
    ];
  }
}

export default HeuristicSelect;
