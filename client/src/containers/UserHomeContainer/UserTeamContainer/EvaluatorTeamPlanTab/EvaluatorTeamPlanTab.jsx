import React, { Component } from 'react';

import { Container, Header, Icon, Divider } from 'semantic-ui-react';

import './EvaluatorTeamPlanTab.css';

export default function EvaluatorTeamPlanTab({ plan }) {
    return <Container
      textAlign="justified"
      fluid
      className="font-size--big"
    >
      <Header as="h2" textAlign="center" icon>
        <Icon name="content" circular/>
        Vertinimo planas
      </Header>
      <Divider />
      <p className="EvaluatorTeamPlanTab pre-line">{plan || '-'}</p>
    </Container>;
}
