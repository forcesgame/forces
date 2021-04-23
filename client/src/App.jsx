import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

import NavBar from './components/NavBar';

import Builder from './views/Builder';
import Error from './views/Error';
import Home from './views/Home';
import Match from './views/Match';
import NotFound from './views/NotFound';
import Queue from './views/Queue';

function App() {
  const { isLoading } = useAuth0;

  if (isLoading) {
    return (
      <h1>Loading...</h1>
    );
  }

  return (
    <>
      <NavBar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/builder" component={Builder} />
        <Route path="/match" component={Match} />
        <Route path="/queue" component={Queue} />
        <Route path="/error" component={Error} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

export default App;
