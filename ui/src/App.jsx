/* eslint-disable max-classes-per-file */
/* eslint "react/react-in-jsx-scope": "off" */
/* globals React ReactDOM */
/* eslint "react/jsx-no-undef": "off" */
/* eslint "no-alert": "off" */

async function graphQLFetch(query, variables = {}) {
  try {
    const response = await fetch(window.ENV.UI_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    });

    const result = await response.json();

    if (result.errors) {
      const error = result.errors[0];

      if (error.extensions.code === 'BAD_USER_INPUT') {
        const details = error
          .extensions
          .exception
          .errors
          .join('\n ');

        alert(`${error.message}:\n ${details}`);
      } else {
        alert(`${error.extensions.code}: ${error.message}`);
      }
    }

    return result.data;
  } catch (e) {
    alert(`Error sending data to server: ${e.message}`);
    return null;
  }
}

/**
 * Parent maintains state of all the users. State is initialized from the
 * server.
 */
class Parent extends React.Component {
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

/**
 * Receives user state via props from Parent
 */
// eslint-disable-next-line react/prefer-stateless-function
class UserTable extends React.Component {
  render() {
    const { users } = this.props;

    // eslint-disable-next-line no-underscore-dangle
    const userRows = users.map((user) => <UserRow key={user._id} user={user} />);

    return (
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>{userRows}</tbody>
      </table>
    );
  }
}

/**
 * Receives user state via props from UserTable
 */
// eslint-disable-next-line react/prefer-stateless-function
class UserRow extends React.Component {
  render() {
    const { user } = this.props;

    return (
      <tr>
        {/* eslint-disable-next-line no-underscore-dangle */}
        <td>{user._id}</td>
        <td>{user.username}</td>
        <td>{user.email}</td>
      </tr>
    );
  }
}

class RegisterForm extends React.Component {
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

    const { registerUser } = this.props;
    registerUser(user);

    // reset form; in the future, this will be unnecessary as user should be
    // redirected (maybe to home page) after registration (implicit auth?)
    form.email.value = '';
    form.username.value = '';
    form.password.value = '';
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

const element = <Parent />;
ReactDOM.render(element, document.getElementById('content'));
