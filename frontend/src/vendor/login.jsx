/* eslint-env browser */
const React = require('react');
const {
  Button, FormGroup, FormControl, ControlLabel,
} = require('react-bootstrap');
const d3 = require('d3');

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value,
    });
  }

  handleSubmit(event) {
    d3.request('/auth/login')
      .header('X-Requested-With', 'XMLHttpRequest')
      .header('Content-Type', 'application/x-www-form-urlencoded')
      .post(`email=${this.state.email}&password=${this.state.password}`, (res) => {
        if (res == null) {
          window.alert('incorrect credentials');
          return;
        }
        const parsedMessage = JSON.parse(res.response);
        if (parsedMessage.status === 'success') {
          this.props.onUserLogin(parsedMessage.auth_token, parsedMessage.vendor_id);
        }
      });
    event.preventDefault();
  }

  render() {
    return (
      <div className="Login">
        <h3>Vendor Login</h3>
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="email" bsSize="large">
            <ControlLabel>Email</ControlLabel>
            <FormControl
              autoFocus
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <Button
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
          >
            Login
          </Button>
        </form>
      </div>
    );
  }
}

module.exports = Login;
