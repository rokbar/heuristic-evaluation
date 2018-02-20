import React from 'react';
import './Layout.css';

export default function Layout(props) {
  const { header: Menu, aside, article } = props;
  return (
    <div className="Layout">
      <Menu />
      <div className="Layout__row-layout">
        <aside className="Aside">
          {props.aside}
          <p>Aside</p>
        </aside>
        <article className="Article">
          {props.article}
        </article>
      </div>
      <footer className="Layout__footer">Footer</footer>
    </div>
  )
}
