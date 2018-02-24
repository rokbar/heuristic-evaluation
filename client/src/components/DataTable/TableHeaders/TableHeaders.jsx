import React from 'react';
import { map } from 'lodash';
import { Table } from 'semantic-ui-react';

export default function TableHeaders({headers}) {
  const renderHeaderRow = (headers) => map(headers, item => (
    <Table.HeaderCell>{item}</Table.HeaderCell>
  ));

  return (
    <Table.Header>
      <Table.Row>
        {renderHeaderRow(headers)}
      </Table.Row>
    </Table.Header>
  )
}