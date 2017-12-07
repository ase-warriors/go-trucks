/* eslint-env browser */
const React = require('react');
const {
  Table, Button, DropdownButton, MenuItem, Well,
} = require('react-bootstrap');
const MapWithAMarkerClusterer = require('./map.jsx');
const d3 = require('d3');
const geolib = require('geolib');

function metricToEmperial(meters) {
  if (meters < 1609) { // less than a mile
    return `${geolib.convertUnit('ft', meters, 0)} ft`;
  }
  return `${geolib.convertUnit('mi', meters, 1)} mi`;
}

function imperialToMetric(mi) {
  return mi * 1609.344;
}

function hashPosts(post) {
  return post.reduce((acc, v) => acc * (1 + (v.vendor_id * v.distance)), 1);
}

class View extends React.Component {
  constructor(props) {
    super(props);
    this.getPosts = this.getPosts.bind(this);
    this.state = {
      posts: [],
      longitude: -73.9625727,
      latitude: 40.8075355,
      searchDistance: 1,
      showVendorDetails: 0,
    }; // init to be Columbia University Low Library Coords
    this.setCurrentLocation = this.setCurrentLocation.bind(this);
    this.onDistanceSelected = this.onDistanceSelected.bind(this);
    this.onVendorSelected = this.onVendorSelected.bind(this);
    this.distances = [0.1, 0.5, 1, 2, 5, 10];
  }

  componentDidMount() {
    this.getPosts();
  }

  componentDidUpdate() {
    this.getPosts();
  }

  onDistanceSelected(key) {
    const intKey = parseInt(key, 10);
    this.setState({
      searchDistance: intKey,
      showVendorDetails: 0,
    });
  }

  onVendorSelected(vendor_id) {
    this.setState({
      showVendorDetails: vendor_id,
    });
  }

  getPosts() {
    d3.request(`/post?lat=${this.state.latitude}&lng=${this.state.longitude}&distance=${this.distances[this.state.searchDistance]}`)
      .header('X-Requested-With', 'XMLHttpRequest')
      .header('Content-Type', 'application/x-www-form-urlencoded')
      .get((res) => {
        const parsedMessage = JSON.parse(res.response);
        const sortedPosts = parsedMessage.map((post) => {
          const postCpy = post;
          postCpy.distance = geolib.getDistance({
            latitude: post.lat,
            longitude: post.lng,
          }, {
            latitude: this.state.latitude,
            longitude: this.state.longitude,
          }, 10, 1);
          return postCpy;
        });
        sortedPosts.sort((a, b) => (a.distance - b.distance));
        if (parsedMessage &&
            hashPosts(this.state.posts) !== hashPosts(sortedPosts)) {
          // process the posts
          this.setState({
            posts: sortedPosts,
          });
        } else if (hashPosts(this.state.posts) === hashPosts(sortedPosts)) {
          console.log('skip getPosts');
        } else {
          console.log('get posts failed');
        }
      });
  }

  getVendorPosts(vendor_id) {
    if (vendor_id === 0) {
    } else if (this.state.posts.length === 0) {
      console.error('no vendor exists yet!');
    }

    for (let i = 0; i < this.state.posts.length; i += 1) {
      if (this.state.posts[i].vendor_id === vendor_id) {
        const vendorInfo = this.state.posts[i];
        const vendorInformationBox = (
          <Well>
            <h4>Vendor Name</h4>
            <p>{vendorInfo.vendor_name}</p>
            <h4>Vendor Schedule</h4>
            <p>{vendorInfo.time}</p>
            <h4>Vendor Location</h4>
            <p>{vendorInfo.location === '' ? 'N/A' : vendorInfo.location}</p>
            <h4>Vendor Menu</h4>
            <p>{vendorInfo.hasOwnProperty('menu') ? vendorInfo.menu : 'N/A'}</p>
          </Well>
        );
        return vendorInformationBox;
      }
    }
    return 'Error vendor not found'
  }

  setCurrentLocation() {
    window.alert('Using user\'s current location');
    navigator.geolocation.getCurrentPosition((l) => {
      this.setState({
        longitude: l.coords.longitude,
        latitude: l.coords.latitude,
      });
    }, () => {
      window.alert("Cannot obtain user's permission to access the current location.");
    });
  }

  tableify() {
    const tableBody = this.state.posts.map((e, i) => (
      <tr key={e.vendor_id} onClick={() => this.onVendorSelected(e.vendor_id)}>
        <td>{`${i + 1}`}</td>
        <td>{e.vendor_name}</td>
        <td>{metricToEmperial(e.distance)}</td>
      </tr>
    ));
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

  render() {
    const myMarkers = this.state.posts.map(e => ({
      longitude: e.lng, latitude: e.lat, vendor_id: e.vendor_id, name: e.vendor_name,
    }));

    const myMap = (
      <MapWithAMarkerClusterer
        markers={myMarkers}
        onMarkerClicked={this.onVendorSelected}
        centerLatitude={this.state.latitude}
        centerLongitude={this.state.longitude}
        circleRadius={imperialToMetric(this.distances[this.state.searchDistance])}
      />);


    const distance_items = this.distances.map((e, i) => (<MenuItem eventKey={`${i}`} key={`distance-item-${i}`}>{`${e} mi`}</MenuItem>));
    const distanceDropdownButton = (
      <DropdownButton bsStyle="primary" title={`Search Distance: ${this.distances[this.state.searchDistance]} mi`} id="dropdown-basic" onSelect={this.onDistanceSelected}>
        { distance_items }
      </DropdownButton>
    );

    let searchResults = (
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

    let vendorDetails = null;
    if (this.state.showVendorDetails > 0) {
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

module.exports = View;
