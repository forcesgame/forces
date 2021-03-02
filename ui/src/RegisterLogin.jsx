import React from 'react';
import { NavLink, Route, Switch } from 'react-router-dom';

import Register from './Register.jsx';
import Login from './Login.jsx';

function RegisterLoginNavBar() {
  return (
    <nav>
      <NavLink to="/registerLogin/register">Sign Up</NavLink>
      {' | '}
      <NavLink to="/registerLogin/login">Login</NavLink>
    </nav>
  );
}

export default function RegisterLogin() {
  return (
    <Switch>
      <Route path="/registerLogin/register">
        <RegisterLoginNavBar />
        <Register />
      </Route>
      <Route path="/registerLogin/login">
        <RegisterLoginNavBar />
        <Login />
      </Route>
      <Route />
    </Switch>
  );
}
