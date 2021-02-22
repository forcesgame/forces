const userDB = [
  {
    userID: 3019238213902138,
    username: 'patrick',
    email: 'patrick@gmail.com',
    password: 'password',
  },
  {
    userID: 12832112839123,
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
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    this.setState({users: userDB});
  }

  render() {
    return (
      <React.Fragment>
        <Heading/>
        <UserTable users={this.state.users}/>
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

const element = <Parent/>
ReactDOM.render(element, document.getElementById('content'));