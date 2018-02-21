import React from 'react';
import {Table} from 'semantic-ui-react';

export default function TableBody({data, headers}) {
  const renderDataRow = (data, headers) => {
    return data.map(item => {
      return (
        <Table.Row>
          {headers.map(header => {
            return <Table.Cell>{item[header]}</Table.Cell>
          })}
        </Table.Row>
      )
    })
  };

  return (
    <Table.Body>
      {renderDataRow(data, headers)}
    </Table.Body>
  )
}
