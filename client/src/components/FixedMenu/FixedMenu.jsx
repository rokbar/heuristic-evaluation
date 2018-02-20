import React from 'react';
import { Menu, Container, Icon, Dropdown } from 'semantic-ui-react';

export default function FixedMenu({ name, logout }) {
  return (
    <Menu fixed='top' inverted>
      <Container>
        <Menu.Item as='a' header>
          Euristinis vertinimas
        </Menu.Item>
        <Menu.Item as='a' position='right'>Pagrindinis</Menu.Item>

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
      </Container>
    </Menu>
  );
}