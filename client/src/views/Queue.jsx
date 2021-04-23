import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import { useQuery } from 'react-query';
import axios from 'axios';

function Queue() {
  const auth0User = useAuth0().user;
  const [auth0Username, setAuth0Username] = useState('');
  const [queueIndex, setQueueIndex] = useState(-1);

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

  const queue = useQuery('queue', async () => {
    const response = await axios.get('/api/queue');

    const { users } = response.data;

    setQueueIndex(users.findIndex((queueUser) => (
      JSON.stringify(queueUser._id) === JSON.stringify(user.data._id)
    )));

    return response.data;
  }, {
    enabled: !!user.data,
    refetchInterval: 5000,
  });

  useEffect(() => {
    initializeAuth0Username();
  }, [auth0User]);

  if (user.isLoading || queue.isLoading) {
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

  if (queue.error) {
    return (
      <Container className="mt-5">
        <span>
          Queue Error:
          {queue.error.message}
        </span>
      </Container>
    );
  }

  if (queueIndex === -1) {
    return (
      <Container className="mt-5">
        <span>not in queue placeholder</span>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <span>in queue placeholder</span>
    </Container>
  );
}

export default withAuthenticationRequired(Queue, {
  onRedirecting: () => (
    <Container className="mt-5">
      <span>Loading...</span>
    </Container>
  ),
});
