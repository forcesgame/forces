import React, { useEffect, useState } from 'react';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import axios from 'axios';

import Container from 'react-bootstrap/Container';
import Map from '../components/match/Map';

function Match() {
  const { user } = useAuth0();
  const [username, setUsername] = useState('');
  const [userID, setUserID] = useState('');
  const [match, setMatch] = useState({});

  const initializeUsername = async () => {
    try {
      const usernameKey = `${process.env.REACT_APP_AUTH0_NAMESPACE}username`;
      setUsername(user[usernameKey]);
    } catch (error) {
      console.error(error.message);
    }
  };

  const initializeUserID = async () => {
    if (!username) return;
    axios.get(`/api/users/${username}`)
      .then((response) => {
        setUserID(response.data._id);
      })
      .catch((error) => console.error(error.message));
  };

  const initializeMatch = async () => {
    if (!userID) return;
    axios.get(`/api/matches/users/${userID}`)
      .then((response) => {
        setMatch(response.data);
      })
      .catch((error) => console.error(error.message));
  };

  useEffect(() => {
    initializeUsername();
  }, []);

  useEffect(() => {
    initializeUserID();
  }, [username]);

  useEffect(() => {
    initializeMatch();
  }, [userID]);

  return (
    <Container>
      <Map
        initialMatch={match}
      />
    </Container>
  );
}

export default withAuthenticationRequired(Match, {
  onRedirecting: () => <h1>Loading...</h1>,
});
