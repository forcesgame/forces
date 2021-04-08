import React, { useEffect, useState } from 'react';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import axios from 'axios';

function Builder() {
  const { user } = useAuth0();
  const [username, setUsername] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [force, setForce] = useState(null);

  async function getForce() {
    try {
      if (username === '') return;
      const response = await axios.get(`/api/forces/${username}`);
      setForce(response.data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  useEffect(() => {
    if (user) {
      const usernameKey = `${process.env.REACT_APP_AUTH0_NAMESPACE}username`;
      setUsername(user[usernameKey]);
    }
    getForce();
  });

  if (force == null) {
    return <h1>Loading</h1>;
  }

  return (
    <>
      <h1>builder</h1>
    </>
  );
}

export default withAuthenticationRequired(Builder, {
  onRedirecting: () => <h1>Loading</h1>,
});
