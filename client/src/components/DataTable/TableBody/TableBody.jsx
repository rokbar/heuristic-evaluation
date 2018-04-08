import React from 'react';
import { map } from 'lodash';
import {Table} from 'semantic-ui-react';

export default function TableBody({ data, headers }) {
  const renderDataRow = (data, headers) => {
    return data.map((item, index) => {
      return (
        <Table.Row key={index}>
          {map(headers, (value, key) => {
            return <Table.Cell key={key}>{item[key]}</Table.Cell>
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
