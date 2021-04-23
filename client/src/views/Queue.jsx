import { withAuthenticationRequired } from '@auth0/auth0-react';
import React from 'react';
import Container from 'react-bootstrap/Container';

function Queue() {
  return (
    <Container className="mt-5">
      <span>Queue placeholder</span>
    </Container>
  );
}

export default withAuthenticationRequired(Queue, {
  onRedirecting: () => (
    <Container className="mt-5">
      <span>Loading...</span>
    </Container>
  ),
});
