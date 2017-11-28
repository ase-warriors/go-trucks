import React from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";

const d3 = require("d3");

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      repassword: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  validateForm() {
    console.log(this.state)
    return this.state.password == this.state.repassword && this.state.email !== "" && this.state.password !== "";
  }

  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleSubmit(event) {
    // var myRequest = new Request('/vendor', {method: 'POST', body: '{"foo":"bar"}'});

    d3.request("/vendor")
      .header("X-Requested-With", "XMLHttpRequest")
      .header("Content-Type", "application/x-www-form-urlencoded")
      .post(`email=${this.state.email}&password=${this.state.password}`, (err, data) => {
        console.log('register returned');
        console.log(data);

        if(err != null) {
          window.alert('registeration failure with:')
          this.props.finish();
        }
        console.log(data.response)
        const parsedMessage = JSON.parse(data.response);
        console.log(parsedMessage)
        if (parsedMessage.status == "success") {
          window.alert('register successful');
          this.props.finish();
        } else {
          window.alert(parsedMessage.message);
        }
      });
    event.preventDefault();
  }

  render() {
    return (
      <div className="Register">
        <h3>Vendor Registeration</h3>
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="email" bsSize="large">
            <ControlLabel>Email</ControlLabel>
            <FormControl
              id="register-email"
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl
              id="register-password"
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <FormGroup controlId="repassword" bsSize="large">
            <ControlLabel>Confirm Password</ControlLabel>
            <FormControl
              id="register-repassword"
              value={this.state.repassword}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <Button
            block
            bsSize="large"
            id="register-submit"
            disabled={!this.validateForm()}
            type="submit"
          >
            Register
          </Button>
        </form>
      </div>
    );
  }
}

module.exports = Register
