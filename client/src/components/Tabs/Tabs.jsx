import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

export default function Tabs(props) {
  const renderPanes = (panes, currentLocation) => {
    return panes.map(item => {
      const { name, pathName, activeItem } = item;
      const regex = new RegExp('^' + pathName);
      return <Menu.Item
        content={name}
        active={regex.test(currentLocation)}
        as={Link} to={pathName}
      />
    })
  };

  const { panes, currentLocation } = props;
  return (
    <Menu attached="top" tabular>
      {renderPanes(panes, currentLocation)}
    </Menu>
  )
}
