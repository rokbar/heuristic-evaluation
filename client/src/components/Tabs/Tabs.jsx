import React from 'react';
import {Link} from 'react-router-dom';
import {Menu} from 'semantic-ui-react';

export default function Tabs(props) {
  const renderPanes = (panes, currentLocation) => {
    return panes.map(item => {
      const {name, pathName, activeItem, hidden} = item;
      const regex = new RegExp('^' + pathName);
      return !hidden
        ? <Menu.Item
          key={name}
          content={name}
          active={regex.test(currentLocation)}
          as={Link} to={pathName}
        />
        : null;
    })
  };

  const {panes, currentLocation} = props;
  return (
    <Menu attached="top" tabular size="large">
      {renderPanes(panes, currentLocation)}
    </Menu>
  )
}
