import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Row from 'react-bootstrap/Row';

export default function Home() {
  const auth0User = useAuth0().user;
  const [auth0Username, setAuth0Username] = useState('');

  const initializeAuth0Username = async () => {
    if (!auth0User) return;
    const usernameKey = `${process.env.REACT_APP_AUTH0_NAMESPACE}username`;
    setAuth0Username(auth0User[usernameKey]);
  };

  const user = useQuery(['users', auth0Username], async () => {
    let response = await axios.get(`/api/users/${auth0Username}`);

    if (response.status === 204) {
      // add new user to MongoDB
      response = await axios.post(`/api/users/${auth0Username}`);

      // generate starter unit set
      await axios.post(`/api/units/users/${response.data._id}`);
    }

    return response.data;
  }, {
    enabled: !!auth0Username,
  });

  useEffect(() => {
    initializeAuth0Username();
  }, [auth0User]);

  if (user.isLoading) {
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

  if (user) {
    return (
      <Container className="mt-5">
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <Card.Link href="#">Versus</Card.Link>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Body>
                <Card.Link href="/builder">Force Builder</Card.Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Jumbotron>
        <h1>Forces</h1>
        <p>A Browser-Based Multiplayer Tactical Turn-Based Game</p>
      </Jumbotron>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Img src="#" alt="gameplay-image-1" />
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Body>
              <Card.Img src="#" alt="gameplay-image-2" />
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Body>
              <Card.Img src="#" alt="gameplay-image-3" />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
