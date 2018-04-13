import React, { Component } from 'react';

import { Container } from 'semantic-ui-react';

export default function EvaluatorTeamPlanTab({ plan }) {
    return <Container
      textAlign="justified"
      fluid
    >
      {plan}
    </Container>;
}