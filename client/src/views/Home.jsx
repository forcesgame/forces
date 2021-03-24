import React from 'react';

import { useAuth0 } from '@auth0/auth0-react';

export default function Home() {
  const { user } = useAuth0();

  if (user) {
    const usernameKey = `${process.env.REACT_APP_AUTH0_NAMESPACE}username`;
    const username = user[usernameKey];
    return (
      <h1>
        Welcome to Forces,
        {' '}
        {username}
        !
      </h1>
    );
  }

  return (
    <h1>Welcome to Forces! Please log in.</h1>
  );
}
