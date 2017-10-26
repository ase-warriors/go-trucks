import React from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";

const d3 = require("d3");

function FieldGroup(props) {
  const {id, type, label, placeholder, onChange} = props;
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl type={type} placeholder={placeholder} onChange={onChange}/>
    </FormGroup>)
  ;
}

class Create extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: "",
      time:"0"
    };
    this.handleChange = this.handleChange.bind(this);
    this.onClickSubmit = this.onClickSubmit.bind(this);
  }
  componentDidMount() {
  }
  onClickSubmit(event) {
    console.log(this.state);
    console.log(`token ${this.props.token}`);
    d3.request("/post/")
      .header("X-Requested-With", "XMLHttpRequest")
      .header("Content-Type", "application/x-www-form-urlencoded")
      .header("Authorization", this.props.token)
      .post(`location=${this.state.location}&time=${this.state.time}`, (res) => {
        console.log(res.response)
        const parsedMessage = JSON.parse(res.response);
        console.log(parsedMessage)
        if (parsedMessage.status == "success") {
          this.props.userLogin(parsedMessage.auth_token);
        } else {
          console.log('login failed');
        }
      });

    event.preventDefault();
  }
  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    });
  };
  render() {
    const formInstance = (
      <form onSubmit = {this.onClickSubmit}>
        <FieldGroup
          id="location"
          label="Enter Posting Location"
          placeholder="e.g. 116th Broadway"
          onChange={this.handleChange}
          />
        <FormGroup controlId="time">
      <ControlLabel>Choose Posting Time</ControlLabel>
      <FormControl componentClass="select" placeholder="Select Posting Time" onChange={this.handleChange}>
        <option value="0">Now</option>
        <option value="15">15 min later</option>
        <option value="30">30 min later</option>
        <option value="60">1 hr later</option>
        <option value="180">3 hrs later</option>
      </FormControl>
      </FormGroup>
      <FormGroup>
        <Button type="submit">
          Submit
        </Button>
      </FormGroup>
      </form>
    );
    return (
      <div>
        <h2>Create Posting</h2>
        <div>{formInstance}</div>
      </div>
    );
  }
}

module.exports = Create;
