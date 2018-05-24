import React from 'react';

import { Breadcrumb as SemanticUIBreadcrumb } from 'semantic-ui-react';

export default function Breadcrumbs({ children }) {
  return <SemanticUIBreadcrumb size='huge'>
    {children}
  </SemanticUIBreadcrumb>
}
