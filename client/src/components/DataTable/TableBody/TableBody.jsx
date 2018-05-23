import React from 'react';
import {map, isArray} from 'lodash';
import {Table} from 'semantic-ui-react';

export default function TableBody({data, headers}) {
  const renderDataRow = (data, headers) => {
    return data.map((item, index) => {
      return (
        <Table.Row key={index} style={{backgroundColor: item['completed'] ? '#d6efd6b8' : ''}}>
          {
            isArray(headers)
              ? map(headers, (value) => {
                return <Table.Cell key={value}>{item[value]}</Table.Cell>;
              })
              : map(headers, (value, key) => {
                return <Table.Cell key={key}>{item[key]}</Table.Cell>;
              })
          }
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
