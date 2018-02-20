import React from 'react';
import Layout from '../Layout';
import './AsideWithArticle.css';

export default function AsideWithArticle(props) {
  return (
    <Layout>
      <aside className="Aside">
        {props.aside}
        <p>Aside</p>
      </aside>
      <article className="Article">
        {props.article}
      </article>
    </Layout>
  )
}
