import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { useMutation, useQuery } from 'react-query';

function Queue() {
  const auth0User = useAuth0().user;
  const [auth0Username, setAuth0Username] = useState('');
  const [userQueueIndex, setUserQueueIndex] = useState(-1);
  const [opponentQueueIndex, setOpponentQueueIndex] = useState(-1);

  const initializeAuth0Username = async () => {
    if (!auth0User) return;
    const usernameKey = `https://www.forcesgame.com/username`;
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

    setUserQueueIndex(users.findIndex((queueUser) => (
      JSON.stringify(queueUser._id) === JSON.stringify(user.data._id)
    )));

    setOpponentQueueIndex(users.findIndex((queueUser) => (
      JSON.stringify(queueUser._id) !== JSON.stringify(user.data._id)
    )));

    // eslint-disable-next-line no-use-before-define
    matchMutation.mutate(userQueueIndex, opponentQueueIndex);

    return response.data;
  }, {
    enabled: !!user.data,
    refetchInterval: 5000,
  });

  const queueMutationJoin = useMutation(async () => {
    await axios.post(`/api/queue/users/${user.data._id}`);
  });

  const queueMutationLeave = useMutation(async () => {
    await axios.delete(`/api/queue/users/${user.data._id}`);
  });

  const matchMutation = useMutation(async () => {
    if (userQueueIndex === -1 || opponentQueueIndex === -1) return;

    if (!queue.data) return;
    const { users } = queue.data;
    const user1 = users[userQueueIndex];
    const user2 = users[opponentQueueIndex];

    if (!user1 || !user2) return;
    const user1ID = users[userQueueIndex]._id;
    const user2ID = users[opponentQueueIndex]._id;

    if (!user1ID || !user2ID) return;
    await axios.post('/api/matches', { user1ID, user2ID });
    await queueMutationLeave.mutate();
  });

  useEffect(() => {
    initializeAuth0Username();
  }, [auth0User]);

  const joinQueue = () => {
    queueMutationJoin.mutate();
  };

  const leaveQueue = () => {
    queueMutationLeave.mutate();
  };

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

  if (userQueueIndex === -1) {
    return (
      <Container className="mt-5">
        <Form onSubmit={joinQueue}>
          <Button type="submit" variant="primary">Join Queue</Button>
        </Form>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Form onSubmit={leaveQueue}>
        <Button type="submit" variant="danger">Leave Queue</Button>
      </Form>
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
