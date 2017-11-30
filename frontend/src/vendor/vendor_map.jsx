import React from "react";
const fetch = require("isomorphic-fetch");
const { compose, withProps, withHandlers } = require("recompose");
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} = require("react-google-maps");
const { MarkerClusterer } = require("react-google-maps/lib/components/addons/MarkerClusterer");

const VendorMap = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyA90PmcPj7JG1hs8-Hu87EBCsQRnk8tsR0&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px`, width: `600px`}} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withHandlers({
    onMarkerClustererClick: () => (markerClusterer) => {
      const clickedMarkers = markerClusterer.getMarkers()
      console.log(`Current clicked markers length: ${clickedMarkers.length}`)
      console.log(clickedMarkers)
    },
  }),
  withScriptjs,
  withGoogleMap
)(props => {
  console.log("mapCenter:"+props.centerLatitude+","+props.centerLongitude);
  var myfunc = props.notifyCoordinatesFromMap;
  const currentLocationMarker = (
    <Marker
      key={'current'}
      position={{lat: props.centerLatitude, lng: props.centerLongitude}}
      icon={{path:google.maps.SymbolPath.CIRCLE, scale: 6}}
      draggable={props.draggable}
      onDragEnd={function () {
        myfunc(this.position.lat(), this.position.lng());
      }}
    />);
  return (<GoogleMap
    defaultZoom={14}
          defaultCenter={{ lat: props.centerLatitude, lng: props.centerLongitude}}
          center={{ lat: props.centerLatitude, lng: props.centerLongitude}}
   >
    {currentLocationMarker}
   </GoogleMap>);
}
);

module.exports = VendorMap
