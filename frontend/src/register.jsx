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
    return this.state.password == this.state.repassword;
  }

  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleSubmit(event) {
    d3.request("/vendor/")
      .header("X-Requested-With", "XMLHttpRequest")
      .header("Content-Type", "application/x-www-form-urlencoded")
      .post(`email=${this.state.email}&password=${this.state.password}`, (res) => {
        if(res == null) {
          window.alert('registeration failure')
          return
        }
        console.log(res.response)
        const parsedMessage = JSON.parse(res.response);
        console.log(parsedMessage)
        if (parsedMessage.status == "success") {
          window.alert('register successful')
          this.props.finish();
        }
      });

 
    event.preventDefault();
  }

  render() {
    return (
      <div className="Login">
        <h3>Vendor Registeration</h3>
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
          <FormGroup controlId="repassword" bsSize="large">
            <ControlLabel>Confirm Password</ControlLabel>
            <FormControl
              value={this.state.repassword}
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
            Register
          </Button>
        </form>
      </div>
    );
  }
}

module.exports = Register
