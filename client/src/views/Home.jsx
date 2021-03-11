import React from 'react';

import { useAuth0 } from '@auth0/auth0-react';

export default function Home() {
  const { user } = useAuth0();

  if (user) {
    return (
      <h1>
        Welcome to Forces,
        {' '}
        {user.nickname}
        !
      </h1>
    );
  }

  return (
    <h1>Welcome to Forces! Please log in.</h1>
  );
}
