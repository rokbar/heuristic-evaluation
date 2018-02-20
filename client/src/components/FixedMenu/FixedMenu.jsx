import React from 'react';
import { Menu, Container, Image, Dropdown } from 'semantic-ui-react';

export default function FixedMenu(props) {
  return (
    <Menu fixed='top' inverted>
      <Container>
        <Menu.Item as='a' header>
          Euristinis vertinimas
        </Menu.Item>
        <Menu.Item as='a'>Pagrindinis</Menu.Item>

        <Dropdown item simple text='Meniu'>
          <Dropdown.Menu>
            <Dropdown.Item>List Item</Dropdown.Item>
            <Dropdown.Item>List Item</Dropdown.Item>
            <Dropdown.Divider/>
            <Dropdown.Header>Header Item</Dropdown.Header>
            <Dropdown.Item>
              <i className='dropdown icon'/>
              <span className='text'>Submenu</span>
              <Dropdown.Menu>
                <Dropdown.Item>List Item</Dropdown.Item>
                <Dropdown.Item>List Item</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Item>
            <Dropdown.Item>List Item</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Container>
    </Menu>
  );
}