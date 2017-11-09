import React from "react";
import { Table, Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
const MapWithAMarkerClusterer = require("./map.jsx");
const d3 = require("d3");

class View extends React.Component {
  constructor(props) {
    super(props);
    this.getPosts = this.getPosts.bind(this);
    this.state = {
      posts: []
    };
  }
  getPosts() {
    d3.request(`/post?lat=${40.8075355}&lng=${-73.9625727}&distance=${5}`)
      .header("X-Requested-With", "XMLHttpRequest")
      .header("Content-Type", "application/x-www-form-urlencoded")
      .get((res) => {
        const parsedMessage = JSON.parse(res.response);
        if (parsedMessage) {
          this.setState({
            posts: parsedMessage
          });
        } else {
          console.log('get posts failed');
        }
      });
  }

  tableify() {
    const tableBody = this.state.posts.map(e => {
      return (
        <tr key={e.vendor_id}>
          <td>{e.vendor_id}</td>
          <td>{e.lat}</td>
          <td>{e.lng}</td>
          <td>{e.time} min later</td>
        </tr>
      );
    })
    return (
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>Vendor #</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Posting Time</th>
          </tr>
        </thead>
        <tbody>
          {tableBody}
        </tbody>
      </Table>);
  }
  componentDidMount() {
    this.getPosts()
  }
  render() {
    const myMarkers = this.state.posts.map(e => ({longitude: e.lng, latitude: e.lat}));

    const myMap = <MapWithAMarkerClusterer markers = {myMarkers} />
    return (
      <div className="view">
        <div id="post-list-table" key="posts_list" className="posting-list">
          {this.tableify()}
        </div>
        <div key="google_map" className="posting-map">{myMap}</div>
      </div>
    );
  }
}

module.exports = View;
