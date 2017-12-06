import React from "react";
const fetch = require("isomorphic-fetch");
const { compose, withProps, withHandlers,withStateHandlers } = require("recompose");
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  Circle,
} = require("react-google-maps");

const { InfoBox } = require("react-google-maps/lib/components/addons/InfoBox");

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
  withStateHandlers(() => ({
    isOpen: false,
  }), {
    onToggleOpen: ({ isOpen }) => () => ({
      isOpen: !isOpen,
    })
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
  console.log('isOpen?:' + props.isOpen);
  return (
    <GoogleMap
      defaultZoom={15}
      defaultCenter={{ lat: props.centerLatitude, lng: props.centerLongitude}}
      center={{ lat: props.centerLatitude, lng: props.centerLongitude}}
    >
      <Circle center={{lat: props.centerLatitude, lng: props.centerLongitude}} radius={props.circleRadius}/>
    {currentLocationMarker}
    <MarkerClusterer
      onClick={props.onMarkerClustererClick}
      averageCenter
      enableRetinaIcons
      gridSize={60}
      defaultMinimumClusterSize={10}
    >
          {props.markers.map((marker,i) => (
        <Marker
          key={marker.latitude + marker.longitude}
          position={{ lat: marker.latitude, lng: marker.longitude }}
          label={`${i+1}`}
          onClick={() => { props.onMarkerClicked(marker.vendor_id); props.onToggleOpen();}}
          >
        </Marker>
      ))}

    </MarkerClusterer>
   </GoogleMap>);
}
);

module.exports = MapWithAMarkerClusterer
