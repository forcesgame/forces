import React, { useEffect, useState } from 'react';

import { useAuth0 } from '@auth0/auth0-react';

import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Row from 'react-bootstrap/Row';
import axios from 'axios';

export default function Home() {
  const { user } = useAuth0();
  const [username, setUsername] = useState('');
  const [userID, setUserID] = useState('');

  const initializeUsername = async () => {
    if (!user) return;
    const usernameKey = `${process.env.REACT_APP_AUTH0_NAMESPACE}username`;
    setUsername(user[usernameKey]);
  };

  const addUserToDatabase = async () => {
    if (userID) return;
    axios.get(`/api/users/${username}`)
      .then((getResponse) => {
        if (getResponse.status === 204) {
          axios.post(`/api/users/${username}`)
            .then((postResponse) => {
              setUserID(postResponse.data._id);
            })
            .catch((error) => console.error(error.message));
        }
      })
      .catch((error) => console.error(error.message));
  };

  const initializeUserID = async () => {
    if (!username) return;
    axios.get(`/api/users/${username}`)
      .then(async (response) => {
        if (response.status === 204) {
          await addUserToDatabase();
        } else {
          setUserID(response.data._id);
        }
      })
      .catch((error) => console.error(error.message));
  };

  useEffect(() => {
    initializeUsername();
  }, [user]);

  useEffect(() => {
    initializeUserID();
  }, [username]);

  useEffect(() => {
    addUserToDatabase();
  }, [userID]);

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
