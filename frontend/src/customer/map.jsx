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

const MapWithAMarkerClusterer = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyA90PmcPj7JG1hs8-Hu87EBCsQRnk8tsR0&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `600px`, width: `800px`}} />,
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
  const currentLocationMarker = (
    <Marker
       key={'current'}
      position={{lat: props.centerLatitude, lng: props.centerLongitude}}
      icon={{path:google.maps.SymbolPath.CIRCLE, scale: 6}}
    />);
  return (<GoogleMap
    defaultZoom={14}
    defaultCenter={{ lat: props.centerLatitude, lng: props.centerLongitude}}
   >
    {currentLocationMarker}
    <MarkerClusterer
      onClick={props.onMarkerClustererClick}
      averageCenter
      enableRetinaIcons
      gridSize={60}
    >
          {props.markers.map((marker,i) => (
        <Marker
          key={marker.latitude + marker.longitude}
          position={{ lat: marker.latitude, lng: marker.longitude }}
          label={`${i+1}`}
        />
      ))}

    </MarkerClusterer>
   </GoogleMap>);
}
);

module.exports = MapWithAMarkerClusterer
