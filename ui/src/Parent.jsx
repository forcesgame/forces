import React from 'react';
import UserTable from './UserTable.jsx';
import RegisterForm from './RegisterForm.jsx';
import graphQLFetch from './graphQLFetch.js';

/**
 * Parent maintains state of all the users. State is initialized from the
 * server.
 */
export default class Parent extends React.Component {
  constructor() {
    super();
    this.state = { users: [] };
    this.registerUser = this.registerUser.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const query = `
      query {
        getUsers {
          _id
          username
          email
        }
      }`;

    const data = await graphQLFetch(query);

    if (data) {
      this.setState({ users: data.getUsers });
    }
  }

  async registerUser(user) {
    const query = `
      mutation registerUser($user: UserInputs!) {
        registerUser(user: $user) {
          _id
        }
      }`;

    const data = await graphQLFetch(query, { user });

    if (data) {
      this.loadData();
    }
  }

  render() {
    const { users } = this.state;

    return (
      <>
        <Heading />
        <UserTable users={users} />
        <RegisterForm registerUser={this.registerUser} />
      </>
    );
  }
}

function Heading() {
  return (
    <h1>forces</h1>
  );
}
