import React from 'react';
import { withRouter } from 'react-router-dom';
import graphQLFetch from './graphQLFetch.js';

class Register extends React.Component {
  constructor() {
    super();
    this.handleSubmission = this.handleSubmission.bind(this);
  }

  async handleSubmission(e) {
    e.preventDefault();

    const form = document.forms.registerUser;
    const user = {
      email: form.email.value,
      username: form.username.value,
      password: form.password.value,
    };

    const query = `
    mutation registerUser($user: UserInputs!) {
      registerUser(user: $user) {
        _id
      }
    }
    `;

    const data = await graphQLFetch(query, { user });
    const { history } = this.props; // only accessible because we wrap Register with a Router

    if (data) {
      history.push('/registerLogin/login');
    } else {
      history.push('/error');
    }
  }

  render() {
    return (
      <form name="registerUser" onSubmit={this.handleSubmission}>
        <input type="email" name="email" placeholder="email" />
        <input type="text" name="username" placeholder="username" />
        <input type="password" name="password" placeholder="password" />
        <button type="submit">register</button>
      </form>
    );
  }
}

export default withRouter(Register);
