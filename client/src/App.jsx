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
import NotFound from './views/NotFound';
import Versus from './views/Versus';

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
        <Route path="/versus" component={Versus} />
        <Route path="/error" component={Error} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

export default App;
