import axios from 'axios';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';

import { useQuery } from 'react-query';
import Map from '../components/match/Map';

function Match() {
  const auth0User = useAuth0().user;
  const [auth0Username, setAuth0Username] = useState('');

  const initializeAuth0Username = async () => {
    if (!auth0User) return;
    const usernameKey = `${process.env.REACT_APP_AUTH0_NAMESPACE}username`;
    setAuth0Username(auth0User[usernameKey]);
  };

  const user = useQuery(['users', auth0Username], async () => {
    const response = await axios.get(`/api/users/${auth0Username}`);
    return response.data;
  }, {
    enabled: !!auth0Username,
  });

  const match = useQuery(['matches', auth0Username], async () => {
    const response = await axios.get(`/api/matches/users/${user.data._id}`);
    return response.data;
  }, {
    enabled: !!user.data,
  });

  useEffect(() => {
    initializeAuth0Username();
  }, [auth0User]);

  if (user.isLoading || match.isLoading) {
    return (
      <Container className="mt-5">
        <span>Loading...</span>
      </Container>
    );
  }

  if (user.error) {
    return (
      <Container className="mt-5">
        <span>
          User Error:
          {user.error.message}
        </span>
      </Container>
    );
  }

  if (match.error) {
    return (
      <Container className="mt-5">
        <span>
          match error:
          {match.error.message}
        </span>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Map
        match={match.data}
      />
    </Container>
  );
}

export default withAuthenticationRequired(Match, {
  onRedirecting: () => (
    <Container className="mt-5">
      <span>Loading...</span>
    </Container>
  ),
});
