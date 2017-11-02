import React from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";

const d3 = require("d3");

class View extends React.Component {
  constructor(props) {
    super(props);
    this.getPosts = this.getPosts.bind(this);
    this.state = {
      posts: null
    };
  }
  getPosts() {
    d3.request(`/post/`)
      .header("X-Requested-With", "XMLHttpRequest")
      .header("Content-Type", "application/x-www-form-urlencoded")
      .header("Authorization", this.props.token)
      .get(`lat=${40.8075355}&lng=${-73.9625727}&distance=${1.0}`,(res) => {
        console.log(res.response)
        const parsedMessage = JSON.parse(res.response);
        console.log(parsedMessage)
        if (parsedMessage) {
          this.setState({
            posts: parsedMessage
          });
        } else {
          console.log('get posts failed');
        }
      });
  }
  renderMap() {
    var vlocation = {lat: 40.8075, lng: -73.9626};
    var v1loc = {lat: 40.5128, lng: -73.1006};

    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 20,
      center: vlocation,
      //center: v1loc
    });
    var marker1 = new google.maps.Marker({
      position: vlocation,
      map: map,
      title:"Waffles and Dinges"
    });
    var marker2 = new google.maps.Marker({
  	  position: v1loc,
      map: map,
      title:"Nuts for Juices"
    });
  }
  componentDidMount() {
    this.renderMap()
    this.getPosts()
    return
  }
  render() {
    return (
      <div className="view">
        <div>{this.state.posts}</div>
        <div id="map"></div>
      </div>
    );
  }
}

module.exports = View;
