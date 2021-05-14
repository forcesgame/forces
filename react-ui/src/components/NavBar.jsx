import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import AuthenticationButton from './AuthenticationButton';

const NavBar = () => (
  <Navbar bg="dark" variant="dark">
    <Navbar.Brand href="/">
      Forces
    </Navbar.Brand>
    <AuthenticationButton />
  </Navbar>
);

export default NavBar;
