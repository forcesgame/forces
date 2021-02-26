/* globals React */

/**
 * Receives user state via props from Parent
 */
export default function UserTable({ users }) {
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

/**
 * Receives user state via props from UserTable
 */
function UserRow({ user }) {
  return (
    <tr>
      {/* eslint-disable-next-line no-underscore-dangle */}
      <td>{user._id}</td>
      <td>{user.username}</td>
      <td>{user.email}</td>
    </tr>
  );
}
