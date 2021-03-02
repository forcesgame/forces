import React from 'react';

import { Switch, Route, Redirect } from 'react-router-dom';

import Home from './Home.jsx';
import RegisterLogin from './RegisterLogin.jsx';
import Error from './Error.jsx';

const NotFound = () => <h1>Page Not Found</h1>;

export default function Contents() {
  return (
    <Switch>
      <Redirect exact from="/" to="/home" />
      <Route path="/home" component={Home} />
      <Route path="/registerLogin" component={RegisterLogin} />
      <Route path="/error" component={Error} />
      <Route component={NotFound} />
    </Switch>
  );
}
