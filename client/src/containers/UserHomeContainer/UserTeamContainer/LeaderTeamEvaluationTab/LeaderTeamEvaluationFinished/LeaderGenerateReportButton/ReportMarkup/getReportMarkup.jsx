import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import ReportDataTable from './ReportDataTable';

export default function getReportMarkup({ problems = [] }) {
  return renderToStaticMarkup(
    <html>
      <body>
        <ReportDataTable
          problems={problems}
        />
      </body>
    </html>
  );
}
