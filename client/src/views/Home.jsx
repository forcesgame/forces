import React from 'react';

import { useAuth0 } from '@auth0/auth0-react';

import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Row from 'react-bootstrap/Row';

export default function Home() {
  const { user } = useAuth0();

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
