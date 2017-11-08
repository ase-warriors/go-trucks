import React from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";

const d3 = require("d3");
const PlacesWithStandaloneSearchBox = require("./MyStandaloneSearchBox.jsx")

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
      lng: 0.0,
      lat: 0.0,
      time:"0",
      post:null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.onClickSubmit = this.onClickSubmit.bind(this);
    this.getPosts = this.getPosts.bind(this);
    this.notifyCoordinates = this.notifyCoordinates.bind(this);
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
      .post(`location=${this.state.location}&time=${this.state.time}&lat=${this.state.lat}&lng=${this.state.lng}`, (res) => {
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
  notifyCoordinates(co) {
    console.log(co.geometry.location.lat());
    console.log(co.geometry.location.lng());
    const flat = parseFloat(co.geometry.location.lat());
    const flng = parseFloat(co.geometry.location.lng());
    this.setState({
      lng: flng,
      lat: flat,
    });
  }
  render() {
    const formInstance = (
      <form onSubmit = {this.onClickSubmit}>
        <label className="control-label">Enter Posting Location</label>
        <PlacesWithStandaloneSearchBox notifyCoordinates = {this.notifyCoordinates}/>
        <FieldGroup
          id="location"
          label="Predicted Posting Coordinates"
          placeholder={`(${this.state.lng}, ${this.state.lat})`}
          onChange={this.handleChange}
          disabled={true}
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
