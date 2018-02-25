import React from 'react';
import { map } from 'lodash';
import {Table} from 'semantic-ui-react';

export default function TableBody({ data, headers }) {
  const renderDataRow = (data, headers) => {
    return data.map(item => {
      return (
        <Table.Row>
          {map(headers, (value, key) => {
            return <Table.Cell>{item[key]}</Table.Cell>
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
