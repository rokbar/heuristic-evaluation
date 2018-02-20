import React from 'react';
import { Tab } from 'semantic-ui-react';

export default function Tabs(props) {
  const renderPanes = (panes) => {
    return panes.map(item => {
      const { menuItem, component: Component } = item;
      return {
        menuItem,
        render: () => <Tab.Pane><Component /></Tab.Pane>,
      }
    })
  };

  const {panes} = props;
  return (
    <Tab panes={renderPanes(panes)}/>
  )
}
