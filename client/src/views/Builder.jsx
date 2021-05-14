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
    const usernameKey = `https://www.forcesgame.com/username`;
    setAuth0Username(auth0User[usernameKey]);
  };

  const user = useQuery(['users', auth0Username], async () => {
    const response = await axios.get(`/api/users/${auth0Username}`);
    return response.data;
  }, {
    enabled: !!auth0Username,
  });

  const units = useQuery(['units', auth0Username], async () => {
    const response = await axios.get(`/api/units/users/${user.data._id}`);
    return response.data;
  }, {
    enabled: !!user.data,
  });

  // TODO optimize into one PATCH?
  // TODO break down into smaller functions
  const unitsMutation = useMutation((activeUnitIDs) => {
    const activeUnitIDsCopy = [...activeUnitIDs];

    const changedUnits = units.data.map((unit) => {
      const tempUnit = (unit);

      if (activeUnitIDsCopy.includes(unit._id)) {
        tempUnit.active = true;
        const unitIndex = activeUnitIDsCopy.indexOf(unit._id);
        activeUnitIDsCopy.splice(unitIndex, 1);
      } else {
        tempUnit.active = false;
      }
      return tempUnit;
    });

    const activeUnits = changedUnits.filter((unit) => unit.active);

    if (activeUnits.length === 0) {
      window.alert('You must have at least one active unit!');
      return;
    }

    const reducer = (totalRating, unit) => totalRating + unit.rating;
    const forceRating = activeUnits.reduce(reducer, 0);

    if (forceRating > 9) {
      window.alert('The sum of your unit\'s ratings cannot be greater than 9!');
      return;
    }

    changedUnits.forEach((changedUnit) => {
      axios.patch(`/api/units/${changedUnit._id}`, {
        active: changedUnit.active,
      });
    });

    window.alert('Force saved!');
  });

  useEffect(() => {
    initializeAuth0Username();
  }, [auth0User]);

  const onSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const activeUnitIDs = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const pair of formData.entries()) {
      activeUnitIDs.push(pair[1]);
    }

    unitsMutation.mutate(activeUnitIDs);
  };

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
          User Error:
          {user.error.message}
        </span>
      </Container>
    );
  }

  if (units.error) {
    return (
      <Container className="mt-5">
        <span>
          Units error:
          {units.error.message}
        </span>
      </Container>
    );
  }

  if (!units.data || units.data.length === 0) {
    return (
      <></>
    );
  }

  return (
    <Container className="mt-5">
      <p>
        A Force must have at least one unit, and the sum of your units&#39; ratings
        can&#39;t be greater than 9.
      </p>
      <BuilderTable
        units={units.data}
        onSubmit={onSubmit}
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
