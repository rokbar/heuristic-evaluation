import React from 'react';
import { size } from 'lodash';
import { Table } from 'semantic-ui-react';

import TableActions from './TableActions';
import TableHeaders from './TableHeaders';
import TableBody from './TableBody';

export default function DataTable({ actions, headers, data }) {
  return (
    <Table celled>
      {actions && <TableActions actions={actions} headersCount={size(headers)} />}
      <TableHeaders headers={headers} />
      <TableBody data={data} headers={headers} />
    </Table>
  )
}
