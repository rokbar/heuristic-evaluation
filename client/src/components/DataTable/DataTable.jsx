import React from 'react';
import { Table } from 'semantic-ui-react';

import TableHeaders from './TableHeaders';
import TableBody from './TableBody';

export default function DataTable({ headers, data }) {
  return (
    <Table celled>
      <TableHeaders headers={headers} />
      <TableBody data={data} headers={headers} />
    </Table>
  )
}
