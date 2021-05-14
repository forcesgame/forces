import axios from 'axios';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useMutation, useQuery } from 'react-query';

import Map from '../components/match/Map';

const TurnButton = ({ currentTurn, currentUser, endTurn }) => {
  const [buttonText, setButtonText] = useState('End Turn');

  if (currentTurn !== currentUser) {
    if (buttonText === 'Ending turn...') setButtonText('End Turn');
    return (
      <Button
        className="mt-1"
        disabled
        variant="secondary"
      >
        Opponent&apos;s turn...
      </Button>
    );
  }

  return (
    <Form onSubmit={endTurn}>
      <Button
        className="mt-1"
        onClick={() => { setButtonText('Ending turn...'); }}
        type="submit"
      >
        {buttonText}
      </Button>
    </Form>
  );
};

const ReturnToQueueButton = ({ match, user }) => {
  const [buttonText, setButtonText] = useState('Return to Queue');

  if (buttonText === 'Returning to Queue...') {
    return (
      <Button
        className="mt-1"
        disabled
        variant="warning"
      >
        {buttonText}
      </Button>
    );
  }

  return (
    <Button
      className="mt-1"
      onClick={async () => {
        setButtonText('Returning to Queue...');
        await axios.patch(`/api/matches/${match._id}`, {
          gameOverConfirmed: user._id,
        });
      }}
      type="submit"
      variant="warning"
    >
      {buttonText}
    </Button>
  );
};

function Match() {
  const auth0User = useAuth0().user;
  const [auth0Username, setAuth0Username] = useState('');
  const [enemyUsername, setEnemyUsername] = useState('');
  const [matchTiles, setMatchTiles] = useState([]);
  const [matchUnits, setMatchUnits] = useState([]);
  const [systemMessage, setSystemMessage] = useState('...');

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

    const currentUserID = user.data._id;
    const user1ID = response.data.user1._id;

    if (currentUserID === user1ID) {
      setEnemyUsername(response.data.user2.username);
    } else {
      setEnemyUsername(response.data.user1.username);
    }
    return response.data;
  }, {
    enabled: !!user.data,
  });

  const matchMutationEndTurn = useMutation(async () => {
    setSystemMessage('Waiting for opponent...');

    const currentUserID = user.data._id;
    const matchID = match.data._id;
    const user1ID = match.data.user1._id;
    const user2ID = match.data.user2._id;
    let opponentID;

    if (currentUserID === user1ID) {
      opponentID = user2ID;
    } else {
      opponentID = user1ID;
    }

    await Promise.all(matchUnits.map((unit) => axios.patch(`/api/units/${unit._id}`, {
      health: unit.health > 0 ? unit.health : 0,
      stamina: unit.maxStamina,
    })));

    await axios.patch(`/api/matches/${matchID}`, {
      currentTurn: opponentID,
      tiles: matchTiles,
      __v: match.data.__v + 1,
    });
  });

  useEffect(() => {
    initializeAuth0Username();
  }, [auth0User]);

  const endTurn = async (event) => {
    event.preventDefault();
    await matchMutationEndTurn.mutate({});
  };

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

  const enemyStyle = {
    backgroundColor: '#dc3545',
    color: 'white',
  };
  const allyStyle = {
    backgroundColor: '#007bff',
    color: 'white',
  };

  if (match.data?.winner) {
    return (
      <Container style={{ width: '85vmin', height: '85vmin' }} className="p-5">
        <p style={{
          fontSize: '200%',
        }}
        >
          {match.data.winner.username}
          {' '}
          wins!
        </p>
        <Map
          match={match.data}
          user={user.data}
          setMatchTiles={setMatchTiles}
          setMatchUnits={setMatchUnits}
          setSystemMessage={setSystemMessage}
        />
        <ReturnToQueueButton
          match={match.data}
          user={user.data}
        />
      </Container>
    );
  }

  return (
    <Container style={{ width: '85vmin', height: '85vmin' }} className="p-5">
      <p style={{
        fontSize: '200%',
      }}
      >
        <span style={allyStyle}>
          {user.data?.username}
        </span>
        {' '}
        versus
        {' '}
        <span style={enemyStyle}>
          {enemyUsername}
        </span>
      </p>
      <span>
        {systemMessage}
      </span>
      <Map
        match={match.data}
        user={user.data}
        setMatchTiles={setMatchTiles}
        setMatchUnits={setMatchUnits}
        setSystemMessage={setSystemMessage}
      />
      <TurnButton
        currentUser={user.data?.username}
        currentTurn={match.data?.currentTurn.username}
        endTurn={endTurn}
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
