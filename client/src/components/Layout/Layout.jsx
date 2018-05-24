import React from 'react';

import Footer from 'components/Footer';
import { Breadcrumbs as ReactBreadcrumbs} from 'react-breadcrumbs/dist/react-breadcrumbs.min';
import { Breadcrumb as SemanticUIBreadcrumb } from 'semantic-ui-react';
import BreadcrumbsWrapper from 'components/Breadcrumbs';

import './Layout.css';

export default function Layout(props) {
  const { header: Menu, aside, article } = props;
  return (
    <div className="Layout">
      <Menu />
      <div className="Layout__row-layout">
        <ReactBreadcrumbs
          className="Breadcrumbs"
          separator={<SemanticUIBreadcrumb.Divider icon='right chevron'/>}
          wrapper={BreadcrumbsWrapper}
        />
        <aside className="Aside">
          {aside}
        </aside>
        <article className="Article">
          {article}
        </article>
      </div>
      <Footer className="Layout__footer" />
    </div>
  )
}
