import React, { useEffect, useState } from 'react';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import axios from 'axios';

import Container from 'react-bootstrap/Container';
import BuilderTable from '../components/builder/BuilderTable';

function Builder() {
  const { user } = useAuth0();
  const [username, setUsername] = useState('');
  const [userID, setUserID] = useState('');
  const [force, setForce] = useState({});

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

  const initializeForce = async () => {
    if (!userID) return;
    axios.get(`/api/forces/${userID}`)
      .then((response) => {
        setForce(response.data);
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
    initializeForce();
  }, [userID]);

  const onUnitsChange = async (units) => {
    if (!userID) return;
    axios.patch(`/api/forces/${userID}`, { units })
      .then(window.alert('Force saved!'))
      .catch((error) => console.error(error.message));
  };

  if (!force) {
    return (
      <>
        <h1>Loading...</h1>
      </>
    );
  }

  return (
    <Container>
      <BuilderTable
        force={force}
        onUnitsChange={onUnitsChange}
      />
    </Container>
  );
}

export default withAuthenticationRequired(Builder, {
  onRedirecting: () => <h1>Loading</h1>,
});
