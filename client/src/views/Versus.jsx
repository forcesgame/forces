import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';

import { useQuery } from 'react-query';
import axios from 'axios';
import Queue from './Queue';
import Match from './Match';

function Versus() {
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
    refetchInterval: 5000,
  });

  useEffect(() => {
    initializeAuth0Username();
  }, [auth0User]);

  if (user.isLoading) {
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

  if (match.data) {
    return (
      <Match />
    );
  }

  return (<Queue />);
}

export default withAuthenticationRequired(Versus, {
  onRedirecting: () => (
    <Container className="mt-5">
      <span>Loading...</span>
    </Container>
  ),
});
