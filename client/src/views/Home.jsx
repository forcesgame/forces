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
    const usernameKey = `${process.env.REACT_APP_AUTH0_NAMESPACE}username`;
    const username = user[usernameKey];
    return (
      <div>
        <Container>
          <Jumbotron>
            <h1 style={{ textAlign: 'center' }}>
              Welcome to Forces,
              {' '}
              {username}
              !
            </h1>
          </Jumbotron>
        </Container>
        <Container>
          <Row>
            <Col>
              <Jumbotron>
                <p style={{ textAlign: 'center' }}>Versus</p>
              </Jumbotron>
            </Col>
            <Col>
              <Jumbotron>
                <p style={{ textAlign: 'center' }}>Force Builder</p>
              </Jumbotron>
            </Col>
          </Row>
        </Container>
      </div>
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
          <h2 style={{ textAlign: 'center' }}>Description</h2>
        </Jumbotron>
      </Container>
      <Container>
        <Row>
          <Col>
            <Jumbotron>
              <p style={{ textAlign: 'center' }}>Game Play Image: 1</p>
            </Jumbotron>
          </Col>
          <Col>
            <Jumbotron>
              <p style={{ textAlign: 'center' }}>Game Play Image: 2</p>
            </Jumbotron>
          </Col>
          <Col>
            <Jumbotron>
              <p style={{ textAlign: 'center' }}>Game Play Image: 3</p>
            </Jumbotron>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
