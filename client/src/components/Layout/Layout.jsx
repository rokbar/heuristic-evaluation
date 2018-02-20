import React from 'react';
import Footer from 'components/Footer';
import './Layout.css';

export default function Layout(props) {
  const { header: Menu, aside, article } = props;
  return (
    <div className="Layout">
      <Menu />
      <div className="Layout__row-layout">
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
