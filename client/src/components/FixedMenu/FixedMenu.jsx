import React from 'react';

import { Link } from 'react-router-dom';
import { Menu, Container, Icon, Dropdown } from 'semantic-ui-react';

export default function FixedMenu({ name, role, logout }) {
  return (
    <Menu fixed='top' inverted>
      <Container>
        <Menu.Item as={Link} to={`/${role}`} header>
          Euristinis vertinimas
        </Menu.Item>
        <Menu.Menu position="right">
          <Menu.Item as={Link} to={`/${role}/editAccount`}>
            <Icon name="user" size="large" />Paskyra
          </Menu.Item>
          <Menu.Item as={Link} to={`/${role}`} position='right'>
            <Icon name="home" size="large" />Pagrindinis
          </Menu.Item>
          <Dropdown item simple position='right' text='Meniu'>
            <Dropdown.Menu>
              <Dropdown.Header
                content={`Labas, ${name}`}
              />
              <Dropdown.Divider/>
              <Dropdown.Item
                icon='log out'
                content='Atsijungti'
                onClick={logout}
              />
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
      </Container>
    </Menu>
  );
}