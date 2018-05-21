import React from 'react';
import { map } from 'lodash';
import {Table} from 'semantic-ui-react';

export default function TableBody({ data, headers }) {
  const renderDataRow = (data, headers) => {
    return data.map((item, index) => {
      return (
        <Table.Row key={index} style={{backgroundColor: item['completed'] ? '#d6efd6b8' : ''}}>
          {map(headers, (value, key) => {
            return item[key] ? <Table.Cell key={key}>{item[key]}</Table.Cell> : null;
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
