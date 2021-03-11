import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';

import Builder from './pages/Builder';
import Error from './pages/Error';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/builder" component={Builder} />
        <Route path="/error" component={Error} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;
