// sourced from https://auth0.com/blog/complete-guide-to-react-user-authentication/

import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import { useHistory } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
const Auth0ProviderWithHistory = ({ children }) => {
  const history = useHistory();

  const onRedirectCallback = (appState) => {
    history.push(appState?.returnTo || window.location.pathname);
  };

  return (
    <Auth0Provider
      domain="forces.us.auth0.com"
      clientId="Zp9pK5uJrGWmnQ7GL8wnzjJFWdsVbc64"
      redirectUri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
      useRefreshTokens
      cacheLocation="localstorage"
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory;
