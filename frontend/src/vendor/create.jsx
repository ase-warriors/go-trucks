import React from "react";
import { Well, Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";

const d3 = require("d3");
const PlacesWithStandaloneSearchBox = require("./searchbox.jsx");
const CurrentMap = require("./vendor_map.jsx");

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
      lng: -73.9625727,
      lat: 40.8075355,
      time:"",
      post:null,
      menu:"",
    }; // defaults to Columbia
    this.handleChange = this.handleChange.bind(this);
    this.onClickSubmit = this.onClickSubmit.bind(this);
    this.getPosts = this.getPosts.bind(this);
    this.notifyCoordinates = this.notifyCoordinates.bind(this);
    this.notifyCoordinatesFromMap = this.notifyCoordinatesFromMap.bind(this);
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
        if (parsedMessage && parsedMessage.length > 0) {
          this.setState({
            post: parsedMessage,
            lng: parsedMessage[0].lng,
            lat: parsedMessage[0].lat,
          });
        } else {
          console.log('get posts failed');
        }
      });
  }
  notifyCoordinates(co) {
    console.log('notified!');
    console.log(co);
    const flat = parseFloat(co.geometry.location.lat());
    const flng = parseFloat(co.geometry.location.lng());
    this.setState({
      lng: flng,
      lat: flat,
      location: co.formatted_address,
    });
  }

  notifyCoordinatesFromMap(flat, flng) {
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
    const selectMap = (<CurrentMap centerLatitude={this.state.lat} centerLongitude={this.state.lng} draggable={true} notifyCoordinatesFromMap={this.notifyCoordinatesFromMap}/>);

    const formInstance = (
      <form onSubmit = {this.onClickSubmit}>
        <FieldGroup
          id="time"
          label="Enter Schedule (expected hours)"
          placeholder={'e.g. 12pm to 5pm'}
          onChange={this.handleChange}
          />
        <label className="control-label">Enter Posting Location</label>
        <div id="address-validation">
          <PlacesWithStandaloneSearchBox notifyCoordinates = {this.notifyCoordinates}/>
          {selectMap}
        </div>
        <FieldGroup
          id="menu"
          label="Enter Descriptions (special menu, etc.)"
          placeholder={'e.g. Chicken Over Rice'}
          onChange={this.handleChange}
          />
        <FormGroup>
          <Button type="submit" disabled={this.state.lng==0.0 || this.state.time===""}>
            Submit
          </Button>
        </FormGroup>
      </form>
    );
    var currentPost = (
        <Well>
          <p>Last Posting Location: N/A</p>
          <p>Last Posting Time: N/A</p>
          <p>Last Posting Menu: N/A</p>
        </Well>);
    var currentPostMap = (<CurrentMap centerLatitude={0} centerLongitude={0} draggable={false}/>);
    if (this.state.post !== null && this.state.post.length > 0){
      currentPost = (
        <Well>
          <h4>Last Posting Location</h4>
          <p>{this.state.post[0].location}</p>
          <h4>Last Posting Time</h4>
          <p>{this.state.post[0].time}</p>
          <h4>Last Posting Menu</h4>
          <p>{this.state.post[0].menu}</p>
        </Well>);
      currentPostMap =  (<CurrentMap centerLatitude={this.state.post[0].lat} centerLongitude={this.state.post[0].lng} draggable={false}/>);
    }

    return (
      <div className="Create">
        <h2>Current Posting</h2>
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
