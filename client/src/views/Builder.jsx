import React from 'react';
import {
  Col,
  Container,
  Jumbotron,
  Row,
  Card,
} from 'react-bootstrap';

export default function Builder() {
  return (
    <div>
      <h2>Force name</h2>
      <Container>
        <Jumbotron>
          <Container>
            <Row>
              <Col>
                <Card>
                  <p>Unit 1</p>
                </Card>
              </Col>
              <Col>
                <Card>
                  <p>Unit 2</p>
                </Card>
              </Col>
              <Col>
                <Card>
                  <p>Unit 3</p>
                </Card>
              </Col>
              <Col>
                <Card>
                  <p>Unit 4</p>
                </Card>
              </Col>
              <Col>
                <Card>
                  <p>Unit 5</p>
                </Card>
              </Col>
              <Col>
                <Card>
                  <p>Unit 6</p>
                </Card>
              </Col>
            </Row>
          </Container>
        </Jumbotron>
      </Container>
      <h2>Available Units</h2>
      <Container>
        <Container>
          <Row>
            <Col>
              <Card>
                <p>Unit 1</p>
              </Card>
            </Col>
            <Col>
              <Card>
                <p>Unit 2</p>
              </Card>
            </Col>
            <Col>
              <Card>
                <p>Unit 3</p>
              </Card>
            </Col>
            <Col>
              <Card>
                <p>Unit 4</p>
              </Card>
            </Col>
            <Col>
              <Card>
                <p>Unit 5</p>
              </Card>
            </Col>
            <Col>
              <Card>
                <p>Unit 6</p>
              </Card>
            </Col>
          </Row>
        </Container>
      </Container>
    </div>
  );
}
