import React, { useEffect, useState } from 'react';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import axios from 'axios';

import Container from 'react-bootstrap/Container';
import BuilderTable from '../components/builder/BuilderTable';

function Builder() {
  const { user } = useAuth0();
  const [username, setUsername] = useState('');
  const [userID, setUserID] = useState('');
  const [units, setUnits] = useState([]);

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

  const initializeUnits = async () => {
    if (!userID) return;
    axios.get(`/api/units/users/${userID}`)
      .then((response) => {
        setUnits(response.data);
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
    initializeUnits();
  }, [userID]);

  const onUnitsChange = async (changedUnits) => {
    if (!userID) return;
    changedUnits.forEach((changedUnit) => {
      axios.patch(`/api/units/${changedUnit._id}`, changedUnit)
        .catch((error) => console.error(error.message));
    });
    window.alert('Force saved!');
  };

  if (units.length === 0) {
    return (
      <>
        <h1>Loading...</h1>
      </>
    );
  }

  return (
    <Container>
      <BuilderTable
        initialUnits={units}
        onUnitsChange={onUnitsChange}
      />
    </Container>
  );
}

export default withAuthenticationRequired(Builder, {
  onRedirecting: () => <h1>Loading...</h1>,
});
