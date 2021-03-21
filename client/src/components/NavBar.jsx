import React from 'react';
import {
  Navbar,
  Nav,
} from 'react-bootstrap';
import AuthNav from './AuthNav';

const NavBar = () => (
  <nav bg="light" expand="lg">
    <Navbar.Brand href="/">Forces</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
        <Nav.Link href="/builder">Force Builder</Nav.Link>
      </Nav>
    </Navbar.Collapse>
    <AuthNav />
  </nav>
);

export default NavBar;
