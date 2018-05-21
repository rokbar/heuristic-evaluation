import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import ReportDataTable from './ReportDataTable';

import './ReportDataTable/ReportDataTable.css';

export default function getReportMarkup({ problems = [], photos, teamUsers }) {
  const getHeadMarkup = () => {
    return <head
      dangerouslySetInnerHTML={{ __html: '<xml>' +
      '<word:WordDocument>' +
      '<word:View>Print</word:View>' +
      '<word:Zoom>90</word:Zoom>' +
      '<word:DoNotOptimizeForBrowser/></word:WordDocument>' +
      '</xml>' +
      '<style>' +
      'table, th, td {border: 1px solid black;}' +
      'th {text-align: left; vertical-align: center;}' +
      'td {text-align: left; vertical-align: top;}' +
      '.images {margin: 0 auto; text-align: center;}' +
      'table {margin: -50px;}' +
      '</style>'}}>

    </head>;
  };

  const officeKey = 'xmlns:office';
  const officeValue = 'urn:schemas-microsoft-com:office:office';
  const wordKey = 'xmlns:word';
  const wordValue = 'urn:schemas-microsoft-com:office:word';
  const xmlnsKey = 'xmlns';
  const xmlnsValue = 'http://www.w3.org/TR/REC-html40';

  return renderToStaticMarkup(
    <html
      {...{[officeKey]:officeValue}}
      {...{[wordKey]:wordValue}}
      {...{[xmlnsKey]:xmlnsValue}}
    >
      {getHeadMarkup()}
      <body>
      <div>
        <ReportDataTable
          problems={problems}
          photos={photos}
          teamUsers={teamUsers}
        />
      </div>
      </body>
    </html>
  );
}
