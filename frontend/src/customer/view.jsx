import React from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
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
    d3.request(`/post?lat=${40.8075355}&lng=${-73.9625727}&distance=${1000.0}`)
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
  
  componentDidMount() {
    this.getPosts()
  }
  render() {
    const myMarkers = this.state.posts.map(e => ({longitude: e.lng, latitude: e.lat}));

    const myMap = <MapWithAMarkerClusterer markers = {myMarkers} />
    return (
      <div className="view">
        <div key="posts_list">{JSON.stringify(this.state.posts)}</div>
        {myMap}
      </div>
    );
  }
}

module.exports = View;
