import React from 'react';
import { Route } from 'react-router-dom';

import { Breadcrumb as ReactBreadcrumb } from 'react-breadcrumbs/dist/react-breadcrumbs.min';
import { Breadcrumb as SemanticUIBreadcrumb } from 'semantic-ui-react';

export default ({
  component: Component,
  includeSearch = false,
  render,
  ...props
}) => (
  <Route { ...props } render={ routeProps => (
    <ReactBreadcrumb data={{
      title: <SemanticUIBreadcrumb.Section
        link
        active={isRouteActive(routeProps)}
      >{props.title}
      </SemanticUIBreadcrumb.Section>,
      pathname: routeProps.match.url,
      search: includeSearch ? routeProps.location.search : null,
    }}>
      { Component ? <Component { ...routeProps } /> : render(routeProps) }
    </ReactBreadcrumb>
  )} />
)

const isRouteActive = ({ location: { pathname }, match: { url } }) => pathname === url;
