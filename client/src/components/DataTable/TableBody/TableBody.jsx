import React from 'react';
import {map, isArray} from 'lodash';
import {Table} from 'semantic-ui-react';

export default function TableBody({data, headers}) {
  const renderDataRow = (data, headers) => {
    return data.map((item, index) => {
      return (
        <Table.Row key={index} style={{backgroundColor: item['completed'] ? '#a6c5c4' : ''}}>
          {
            isArray(headers)
              ? map(headers, (value) => {
                return <Table.Cell
                  key={value}
                  className="table-cell"
                >
                  {item[value]}
                </Table.Cell>;
              })
              : map(headers, (value, key) => {
                return <Table.Cell
                  key={key}
                  className="table-cell"
                >
                  {item[key]}
                </Table.Cell>;
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
