import React from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";

const d3 = require("d3");

class View extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    // };
  }
  componentDidMount() {
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
  render() {
    return (
      <div id="map"></div>
    );
  }
}

module.exports = View;
