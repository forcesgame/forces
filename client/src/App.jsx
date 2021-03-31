import React, { useCallback, useEffect, useState } from 'react';
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

function App() {
  /*
  - fetch API call with relative URL served by API server
  - in the case of a GET request, message is set based on the url
  - TODO figure out how to POST/PUT from the client
   */

  // eslint-disable-next-line no-unused-vars
  const [message, setMessage] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [isFetching, setIsFetching] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [url, setUrl] = useState('/api');

  const fetchData = useCallback(() => {
    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`response error: ${res.status}`);
        }

        return res.json();
      })
      .then((json) => {
        setMessage(json.message);
        setIsFetching(false);
      }).catch((e) => {
        setMessage(`API call error: ${e}`);
        setIsFetching(false);
      });
  }, [url]);

  useEffect(() => {
    setIsFetching(true);
    fetchData();
  }, [fetchData]);

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
        <Route path="/error" component={Error} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

export default App;
