import React from 'react';
import './Layout.css';

export default function Layout(props) {
  return (
    <div className="Layout">
      <header className="Layout__header">Header</header>
      <div className="Layout__row-layout">
        {props.children}
      </div>
      <footer className="Layout__footer">Footer</footer>
    </div>
  )
}
