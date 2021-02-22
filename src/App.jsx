const userDB = [
  {
    userID: 1,
    username: 'patrick',
    email: 'patrick@gmail.com',
    password: 'password',
  },
  {
    userID: 2,
    username: 'test',
    email: 'test@gmail.com',
    password: 'test',
  }
];


/**
 * Parent maintains state of all the users. For now, this state is initialized
 * from the frontend (userDB)
 */
class Parent extends React.Component {
  constructor() {
    super();
    this.state = {users: []};
    this.registerUser = this.registerUser.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    this.setState({users: userDB});
  }

  registerUser(user) {
    // TODO use more robust ID generation algorithm
    user.userID = this.state.users.length + 1;
    const newUserList = this.state.users.slice();
    newUserList.push(user);
    this.setState({users: newUserList});
  }

  render() {
    return (
      <React.Fragment>
        <Heading/>
        <UserTable users={this.state.users}/>
        <RegisterForm registerUser={this.registerUser}/>
      </React.Fragment>
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
class UserTable extends React.Component {
  render() {
    const users = this.props.users;

    const userRows = users.map(user =>
      <UserRow key={user.userID} user={user}/>);

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
class UserRow extends React.Component {
  render() {
    const user = this.props.user;

    return (
      <tr>
        <td>{user.userID}</td>
        <td>{user.username}</td>
        <td>{user.email}</td>
      </tr>
    )
  }
}

class RegisterForm extends React.Component {
  constructor() {
    super();
    this.handleSubmission = this.handleSubmission.bind(this);
  }

  handleSubmission(e) {
    e.preventDefault();

    const form = document.forms.registerUser;
    const user = {
      email: form.email.value,
      username: form.username.value,
      password: form.password.value,
    }

    this.props.registerUser(user);

    // reset form; in the future, this will be unnecessary as user should be
    // redirected (maybe to home page) after registration (implicit auth?)
    form.email.value = "";
    form.username.value = "";
    form.password.value = "";
  }

  render() {
    return (
      <form name="registerUser" onSubmit={this.handleSubmission}>
        <input type="email" name="email" placeholder="email"/>
        <input type="text" name="username" placeholder="username"/>
        <input type="password" name="password" placeholder="password"/>
        <button>register</button>
      </form>
    )
  }
}

const element = <Parent/>
ReactDOM.render(element, document.getElementById('content'));