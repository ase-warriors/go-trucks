import React from "react";
import { Well, Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";

const d3 = require("d3");
const PlacesWithStandaloneSearchBox = require("./searchbox.jsx");
const CurrentMap = require("./current_map.jsx");

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
      menu:"",
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
    d3.request(`/vendor/${this.props.vendorID}/post`)
      .header("X-Requested-With", "XMLHttpRequest")
      .header("Content-Type", "application/x-www-form-urlencoded")
      .header("Authorization", this.props.token)
      .post(`location=${this.state.location}&time=${this.state.time}&lat=${this.state.lat}&lng=${this.state.lng}&menu=${this.state.menu}`, (res) => {
        console.log(res.response)
        const parsedMessage = JSON.parse(res.response);
        console.log(parsedMessage)
        if (parsedMessage.status == "success") {
          window.alert('Post Successful!')
          this.getPosts();
        } else {
          window.alert('Post Failed!')
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

  getSelectedCoordinates() {
    if (this.state.lng === 0.0 && this.state.lat === 0.0) {
      return 'N/A';
    } else {
      return `(${this.state.lng.toFixed(3)},${this.state.lat.toFixed(3)})`;
    }
  }
  render() {
    const selectMap = (<CurrentMap centerLatitude={this.state.lat} centerLongitude={this.state.lng} />);

    const formInstance = (
      <form onSubmit = {this.onClickSubmit}>
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
        <label className="control-label">Enter Posting Location</label>
        <div id="address-validation">
          <PlacesWithStandaloneSearchBox notifyCoordinates = {this.notifyCoordinates}/>
          <FormControl.Static>
            Selected Location: {this.getSelectedCoordinates()}
          </FormControl.Static>
        </div>
        <FieldGroup
          id="menu"
          label="Enter Descriptions (special menu, etc.)"
          placeholder={'e.g. Chicken Over Rice'}
          onChange={this.handleChange}
          />
        <FormGroup>
          <Button type="submit" disabled={this.state.lng==0.0}>
            Submit
          </Button>
        </FormGroup>
      </form>
    );
    var currentPost = (
        <Well>
          <p>Last Posting Coords: N/A</p>
          <p>Last Posting Time: N/A</p>
          <p>Last Posting Menu: N/A</p>
        </Well>);
    var currentPostMap = (<CurrentMap centerLatitude={0} centerLongitude={0} />);
    if (this.state.post !== null && this.state.post.length > 0){
      currentPost = (
        <Well>
          <p>Last Posting Coords: ({this.state.post[0].lat}, {this.state.post[0].lng})</p>
          <p>Last Posting Time: {this.state.post[0].time} minutes later</p>
          <p>Last Posting Menu: {this.state.post[0].menu}</p>
        </Well>);
      currentPostMap =  (<CurrentMap centerLatitude={this.state.post[0].lat} centerLongitude={this.state.post[0].lng} />);
    }

    return (
      <div className="Create">
        <h2>Current Postings</h2>
        <div id="current-posting">
             {currentPost}
             {currentPostMap}
        </div>
        <h2>Create Posting</h2>
        <div>{formInstance}</div>
      </div>
    );
  }
}

module.exports = Create;
