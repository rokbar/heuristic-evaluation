import React, { Component } from 'react';
import { map, reduce, isString } from 'lodash';
import { Table } from 'semantic-ui-react';

export default function TableHeaders({headers, hasGroupedHeaders = false}) {
  const renderHeaderRow = (headers) => map(headers, (item, key) => {
    if (!isString(item) && !item.isChildHeader) {
      return <Table.HeaderCell colSpan={item.children && item.children.length} key={key}>{item && item.headerName}</Table.HeaderCell>;
    }
    return <Table.HeaderCell rowSpan={hasGroupedHeaders ? '2' : '1'} key={key}>{item}</Table.HeaderCell>;
  });

  const renderHeaderGroupChildrenRows = (headers) => reduce(headers, (result, header) => {
    const childHeaderRows = header.children
      ? map(header.children, ({headerName}) => (<Table.HeaderCell>{headerName}</Table.HeaderCell>))
      : null;
    return result.concat(childHeaderRows);
  }, []);

  return (
    <Table.Header>
      <Table.Row>
        {renderHeaderRow(headers)}
      </Table.Row>
      {hasGroupedHeaders && <Table.Row>{renderHeaderGroupChildrenRows(headers)}</Table.Row>}
    </Table.Header>
  )
}