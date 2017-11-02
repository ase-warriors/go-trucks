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
      time:"0",
      post:null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.onClickSubmit = this.onClickSubmit.bind(this);
    this.getPosts = this.getPosts.bind(this);
  }
  componentDidMount() {
    this.getPosts();
  }
  onClickSubmit(event) {
    console.log(this.state);
    console.log(`token ${this.props.token}`);
    d3.request(`/vendor/${this.props.vendorID}/post`)
      .header("X-Requested-With", "XMLHttpRequest")
      .header("Content-Type", "application/x-www-form-urlencoded")
      .header("Authorization", this.props.token)
      .post(`location=${this.state.location}&time=${this.state.time}&lat=${42.71}&lng=${-73.9626}`, (res) => {
        console.log(res.response)
        const parsedMessage = JSON.parse(res.response);
        console.log(parsedMessage)
        if (parsedMessage.status == "success") {
          this.getPosts();
        } else {
          console.log("post failed")
        }
      });

    event.preventDefault();
  }
  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    });
  };
  getPosts() {
    d3.request(`/vendor/${this.props.vendorID}/post`)
      .header("X-Requested-With", "XMLHttpRequest")
      .header("Content-Type", "application/x-www-form-urlencoded")
      .header("Authorization", this.props.token)
      .get((res) => {
        console.log(res.response)
        const parsedMessage = JSON.parse(res.response);
        console.log(parsedMessage)
        if (parsedMessage) {
          this.setState({
            post: parsedMessage
          });
        } else {
          console.log('get posts failed');
        }
      });
  }
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
      <div className="Create">
        <h2>Current Postings</h2>
        <div><p>{JSON.stringify(this.state.post)}</p></div>
        <h2>Create Posting</h2>
        <div>{formInstance}</div>
      </div>
    );
  }
}

module.exports = Create;
