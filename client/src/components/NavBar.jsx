import React from 'react';
import {
  Navbar,
  Nav,
  NavDropdown,
} from 'react-bootstrap';
import AuthNav from './AuthNav';

const NavBar = () => (
  <Navbar bg="light">
    <Navbar.Brand href="/">
      <img
        src="#"
        alt="Forces Logo"
      />
      {' '}
      Forces
    </Navbar.Brand>
    <Navbar.Toggle />
    <Navbar.Collapse>
      <Nav className="mr-auto">
        <NavDropdown
          title={(
            <div>
              <img
                src="#"
                alt="Dropdown Menu"
              />
            </div>
          )}
          id="basic-nav-dropdown"
        >
          <NavDropdown.Item href="/builder">Builder</NavDropdown.Item>
          <AuthNav />
        </NavDropdown>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

export default NavBar;
