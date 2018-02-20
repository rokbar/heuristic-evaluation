import React from 'react';
import {Table} from 'semantic-ui-react';

export default function TableBody({ data, headers }) {
  const renderDataRow = (data, headers) => {
    return (
      <Table.Row>
        {data.map(item => {
          headers.map(header => <Table.Cell>item[header]</Table.Cell>)
        })}
      </Table.Row>
    )
  };

  return (
    <Table.Body>
      {renderDataRow(data, headers)}
    </Table.Body>
  )
}
