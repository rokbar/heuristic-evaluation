import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

export default function getReportMarkup(problems) {
  return renderToStaticMarkup(
    <html>
      <body>
        <div>labas</div>
      </body>
    </html>
  );
}
