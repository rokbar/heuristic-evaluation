import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import ReportDataTable from './ReportDataTable';

export default function getReportMarkup({ problems = [], heuristic }) {
  return renderToStaticMarkup(
    <html>
      <body>
        <ReportDataTable
          problems={problems}
          heuristic={heuristic}
        />
      </body>
    </html>
  );
}
