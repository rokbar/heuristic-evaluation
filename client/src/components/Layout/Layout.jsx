import React from 'react';
import Footer from 'components/Footer';
import './Layout.css';

export default function Layout(props) {
  const { header: Menu, aside: AsideContent, article: ArticleContent } = props;
  return (
    <div className="Layout">
      <Menu />
      <div className="Layout__row-layout">
        <aside className="Aside">
          <AsideContent />
        </aside>
        <article className="Article">
          <ArticleContent />
        </article>
      </div>
      <Footer className="Layout__footer" />
    </div>
  )
}
