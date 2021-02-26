import React from 'react';

export default class RegisterForm extends React.Component {
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
