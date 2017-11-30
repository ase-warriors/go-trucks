import React from "react";
import { Table, Button, FormGroup, FormControl, ControlLabel, DropdownButton,MenuItem, Well} from "react-bootstrap";
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
      vendorDetailPosts: [],
    }; // init to be Columbia University Low Library Coords
    this.setCurrentLocation = this.setCurrentLocation.bind(this);
    this.onDistanceSelected = this.onDistanceSelected.bind(this);
    this.onVendorSelected = this.onVendorSelected.bind(this);
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
  getVendorPosts(vendor_id) {
    if (vendor_id == 0) {
      console.error('no vendor selected!');
    } else if (this.state.posts.length == 0) {
      console.error('no vendor exists yet!');
    }

    for (var i=0; i < this.state.posts.length; i++) {
      if (this.state.posts[i].vendor_id == vendor_id) {
        const vendorInfo = this.state.posts[i];
        console.log(vendorInfo);
        const vendorInformationBox = (
          <Well>
            <h4>Vendor Name</h4>
            <p>{vendorInfo.vendor_name}</p>
            <h4>Vendor Schedule</h4>
            <p>{vendorInfo.time}</p>
            <h4>Vendor Location</h4>
            <p>{vendorInfo.location === "" ? "N/A" : vendorInfo.location}</p>
            <h4>Vendor Menu</h4>
            <p>{vendorInfo.hasOwnProperty('menu') ? vendorInfo.menu : "N/A"}</p>
          </Well>
        );
        return vendorInformationBox;
      }
    }
    console.error('vendor id not found');
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
          if (this.hashPosts(this.state.posts) === this.hashPosts(parsedMessage))
            console.log('skip getPosts');
          else
            console.log('get posts failed');
        }
      });
  }
  tableify() {
    const tableBody = this.state.posts.map((e,i)=> {
      return (
        <tr key={e.vendor_id} onClick={() => this.onVendorSelected(e.vendor_id)}>
          <td>{`${i+1}`}</td>
          <td>{e.vendor_name}</td>
          <td>{metricToEmperial(geolib.getDistance({
              latitude: e.lat,
              longitude: e.lng
              },{
                latitude: this.state.latitude,
                longitude: this.state.longitude
            },10,1))}</td>
        </tr>
      );
    })
    return (
      <Table striped bordered condensed hover responsive>
        <thead>
          <tr>
            <th>Results</th>
            <th>Vendor Name</th>
            <th>Distance</th>
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
    this.setState({searchDistance: intKey, showVendorDetails: 0})
  }

  onVendorSelected(vendor_id) {
    console.log(vendor_id + " is clicked.");
    this.setState({showVendorDetails: vendor_id})
    d3.request(`/`)
  }
  render() {
    const myMarkers = this.state.posts.map(e => ({longitude: e.lng, latitude: e.lat, vendor_id: e.vendor_id}));
    console.log("map generated with:");
    console.log(this.state.longitude);
    console.log(this.state.latitude);
    const myMap = (
      <MapWithAMarkerClusterer
        markers={myMarkers}
        onMarkerClicked={this.onVendorSelected}
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
          <h3>Vendor Details</h3>
          <div id="vendor-details-well">
            {this.getVendorPosts(this.state.showVendorDetails)}
          </div>
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
