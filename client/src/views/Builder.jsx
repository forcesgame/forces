import React, { useEffect, useState } from 'react';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import axios from 'axios';

function Builder() {
  const { user } = useAuth0();
  const [username, setUsername] = useState('');
  const [userID, setUserID] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [force, setForce] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [activeUnits, setActiveUnits] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [inactiveUnits, setInactiveUnits] = useState([]);

  const initializeUsername = async () => {
    try {
      const usernameKey = `${process.env.REACT_APP_AUTH0_NAMESPACE}username`;
      setUsername(user[usernameKey]);
    } catch (error) {
      console.error(error.message);
    }
  };

  const initializeUserID = async () => {
    if (username === '') return;
    axios.get(`/api/users/${username}`)
      .then((response) => {
        setUserID(response.data._id);
      })
      .catch((error) => console.error(error.message));
  };

  const initializeForce = async () => {
    if (userID === '') return;
    axios.get(`/api/forces/${userID}`)
      .then((response) => {
        setForce(response.data);
        setActiveUnits(response.data.activeUnits);
        setInactiveUnits(response.data.inactiveUnits);
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

  if (force === {}) {
    return (
      <>
        <h1>Loading...</h1>
      </>
    );
  }

  return (
    <>
      <h1>
        {console.log(force)}
      </h1>
    </>
  );
}

export default withAuthenticationRequired(Builder, {
  onRedirecting: () => <h1>Loading</h1>,
});
