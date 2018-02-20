import React from 'react';
import FixedMenu from 'components/FixedMenu';
import './Layout.css';

export default function Layout(props) {
  return (
    <div className="Layout">
      <FixedMenu />
      <div className="Layout__row-layout">
        {props.children}
      </div>
      <footer className="Layout__footer">Footer</footer>
    </div>
  )
}
