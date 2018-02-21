import React from 'react';
import { Table, Button, Icon } from 'semantic-ui-react';

export default function TableActions(props) {
  const { actions, headersCount } = props;
  return (
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell colSpan={headersCount}>
          {actions}
        </Table.HeaderCell>
      </Table.Row>
    </Table.Header>
  )
}
