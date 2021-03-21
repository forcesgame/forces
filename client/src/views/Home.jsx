import React from 'react';

import { useAuth0 } from '@auth0/auth0-react';

import {
  Container,
  Jumbotron,
  Row,
  Col,
} from 'react-bootstrap';

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
    <div>
      <Container>
        <Jumbotron>
          <h1 style={{ textAlign: 'center' }}>Welcome to Forces! Please log in.</h1>
        </Jumbotron>
      </Container>
      <Container>
        <Jumbotron>
          <h2>Description</h2>
        </Jumbotron>
      </Container>
      <Container>
        <Row>
          <Col>
            <Jumbotron>
              <p>Game Play Image: 1</p>
            </Jumbotron>
          </Col>
          <Col>
            <Jumbotron>
              <p>Game Play Image: 2</p>
            </Jumbotron>
          </Col>
          <Col>
            <Jumbotron>
              <p>Game Play Image: 3</p>
            </Jumbotron>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
