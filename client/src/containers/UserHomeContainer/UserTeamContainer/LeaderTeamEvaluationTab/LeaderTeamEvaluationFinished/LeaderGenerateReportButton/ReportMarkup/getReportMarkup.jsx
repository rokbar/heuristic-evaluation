import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import ReportDataTable from './ReportDataTable';

export default function getReportMarkup({ problems = [], photos }) {
  return renderToStaticMarkup(
    <html>
      <body>
        <ReportDataTable
          problems={problems}
          photos={photos}
        />
      </body>
    </html>
  );
}
