import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import { useMutation, useQuery } from 'react-query';

import BuilderTable from '../components/builder/BuilderTable';

function Builder() {
  const auth0User = useAuth0().user;
  const [auth0Username, setAuth0Username] = useState('');

  const initializeAuth0Username = async () => {
    if (!auth0User) return;
    const usernameKey = `${process.env.REACT_APP_AUTH0_NAMESPACE}username`;
    setAuth0Username(auth0User[usernameKey]);
  };

  const user = useQuery(['users', auth0Username], async () => {
    if (!auth0Username) return;

    const response = await axios.get(`/api/users/${auth0Username}`);
    // eslint-disable-next-line consistent-return
    return response.data;
  });

  const units = useQuery(['units', auth0Username], async () => {
    if (!user.data) return;

    const response = await axios.get(`/api/units/users/${user.data._id}`);
    // eslint-disable-next-line consistent-return
    return response.data;
  });

  // TODO optimize into one PATCH?
  const unitsMutation = useMutation((changedUnits) => {
    if (!user.data) return;

    changedUnits.forEach((changedUnit) => {
      axios.patch(`/api/units/${changedUnit._id}`, changedUnit);
    });

    window.alert('Force saved!');
  });

  useEffect(() => {
    initializeAuth0Username();
  }, [auth0User]);

  if (user.isLoading || units.isLoading) {
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
          Error:
          {`user error: ${user.error.message}`}
        </span>
      </Container>
    );
  }

  if (units.error) {
    return (
      <Container className="mt-5">
        <span>
          Error:
          {`units error: ${units.error.message}`}
        </span>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <BuilderTable
        initialUnits={units.data}
        mutateUnits={unitsMutation.mutate}
      />
    </Container>
  );
}

export default withAuthenticationRequired(Builder, {
  onRedirecting: () => (
    <Container className="mt-5">
      <span>Loading...</span>
    </Container>
  ),
});
