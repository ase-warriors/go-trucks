import React from "react";
import { Table, Button, FormGroup, FormControl, ControlLabel, DropdownButton,MenuItem } from "react-bootstrap";
const MapWithAMarkerClusterer = require("./map.jsx");
const d3 = require("d3");
const geolib = require("geolib");

class View extends React.Component {
  constructor(props) {
    super(props);
    this.getPosts = this.getPosts.bind(this);
    this.state = {
      posts: [],
      longitude: -73.9625727,
      latitude: 40.8075355,
      searchDistance: 0,
      showVendorDetails: 0,
    }; // init to be Columbia University Low Library Coords
    this.setCurrentLocation = this.setCurrentLocation.bind(this);
    this.onDistanceSelected = this.onDistanceSelected.bind(this);
    this.onMarkerClicked = this.onMarkerClicked.bind(this);
    this.hashPosts = this.hashPosts.bind(this);
    this.distances = [0.1, 0.5, 1, 5];
  }
  setCurrentLocation() {
    window.alert(`Using user's current location`);
    navigator.geolocation.getCurrentPosition(l => {
      console.log(l);
      this.setState({
        longitude: l.coords.longitude,
        latitude: l.coords.latitude,
      });
    }, err => {
      console.log("Cannot obtain user's permission.")
    });
  }

  hashPosts(post) {
    return post.reduce((acc, v, i) => acc*(1+v.vendor_id), 1);
  }
  getPosts() {
    console.log('getPosts called!');
    d3.request(`/post?lat=${this.state.latitude}&lng=${this.state.longitude}&distance=${this.distances[this.state.searchDistance]}`)
      .header("X-Requested-With", "XMLHttpRequest")
      .header("Content-Type", "application/x-www-form-urlencoded")
      .get((res) => {
        const parsedMessage = JSON.parse(res.response);
        if (parsedMessage && this.hashPosts(this.state.posts) !== this.hashPosts(parsedMessage)) {
          console.log(this.hashPosts(parsedMessage));
          console.log(this.hashPosts(this.state.posts));
          this.setState({
            posts: parsedMessage
          });
        } else {
          console.log('get posts failed');
          console.log(parsedMessage);
          console.log(this.state.posts);
        }
      });
  }

  tableify() {
    const tableBody = this.state.posts.map((e,i)=> {
      return (
        <tr key={e.vendor_id}>
          <td>{`${i+1}`}</td>
          <td>{e.vendor_name}</td>
          <td>{metricToEmperial(geolib.getDistance({
              latitude: e.lat,
              longitude: e.lng
              },{
                latitude: this.state.latitude,
                longitude: this.state.longitude
            },10,1))}</td>
          <td>{e.time} min later</td>
        </tr>
      );
    })
    return (
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>Results</th>
            <th>Vendor Name</th>
            <th>Distance</th>
            <th>Posting Time</th>
          </tr>
        </thead>
        <tbody>
          {tableBody}
        </tbody>
      </Table>);
  }
  
  componentDidMount() {
    this.getPosts();
  }

  componentDidUpdate() {
    this.getPosts();
  }

  onDistanceSelected(key) {
    const intKey = parseInt(key)
    this.setState({searchDistance: intKey})
  }

  onMarkerClicked(vendor_id) {
    console.log(vendor_id + " is clicked.");
    this.setState({showVendorDetails: vendor_id})
  }
  render() {
    const myMarkers = this.state.posts.map(e => ({longitude: e.lng, latitude: e.lat, vendor_id: e.vendor_id}));
    console.log("map generated with:");
    console.log(this.state.longitude);
    console.log(this.state.latitude);
    const myMap = (
      <MapWithAMarkerClusterer
        markers={myMarkers}
        onMarkerClicked={this.onMarkerClicked}
        centerLatitude={this.state.latitude}
        centerLongitude={this.state.longitude}
        />);


    const distance_items = this.distances.map((e, i) => (<MenuItem eventKey={`${i}`} key={`${i}`}>{e+' mi'}</MenuItem>));
    const distanceDropdownButton =
          (<DropdownButton bsStyle={'primary'} title={`Search Distance: ${this.distances[this.state.searchDistance]} mi`} id={`dropdown-basic`} onSelect={this.onDistanceSelected}>
           {distance_items}
           </DropdownButton>
          );

    var searchResults = (
      <div id="search-results">
        <h3>No Nearby Vendors</h3>
        <p>Please try to increase the search distance.</p>
      </div>);

    if (this.state.posts.length > 0) {
      searchResults = (
        <div id="search-results">
          <h3>Found {this.state.posts.length} Nearby Vendors </h3>
          <div id="post-list-table" key="posts_list" className="posting-list">
            {this.tableify()}
          </div>
        </div>
      );
    }

    var vendorDetails = null;
    if (this.state.showVendorDetails > 0){
      vendorDetails = (
        <div id="vendor-details">
          <h3>Vendor</h3>
          <p>Showing vendor {this.state.showVendorDetails}</p>
        </div>);
    }

    return (
      <div className="view">
        <Button onClick={this.setCurrentLocation}>Use Current Location</Button>
        {distanceDropdownButton}
        <div className="horizontal_view">
          <div className="details">
            {searchResults}
            {vendorDetails}
          </div>
          <div key="google_map" className="posting-map">{myMap}</div>
        </div>
      </div>
    );
  }
}
function metricToEmperial(meters) {
  if (meters < 1609) { // less than a mile
    return geolib.convertUnit('ft', meters, 0) + ' ft';
  } else {
    return geolib.convertUnit('mi', meters, 1) + ' mi';
  }
}

module.exports = View;
