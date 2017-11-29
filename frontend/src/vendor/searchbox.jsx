import React from "react";
const { compose, withProps, lifecycle } = require("recompose");
const {
  withScriptjs,
} = require("react-google-maps");
const { StandaloneSearchBox } = require("react-google-maps/lib/components/places/StandaloneSearchBox");

const PlacesWithStandaloneSearchBox = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyA90PmcPj7JG1hs8-Hu87EBCsQRnk8tsR0&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
  }),
  lifecycle({
    componentWillMount() {
      const refs = {}

      this.setState({
        places: [],
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces();
          if (places.length > 0) {
            this.props.notifyCoordinates(places[0])
          }
          this.setState({
            places,
          });
        },
      })
    },
  }),
  withScriptjs  
)(props =>
  (<div data-standalone-searchbox="" className = "form-group">
    <StandaloneSearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      onPlacesChanged={props.onPlacesChanged}
    >
       <input
        type="text"
        placeholder="e.g. 2920 Broadway, New York"
        className="form-control"
      />
    </StandaloneSearchBox>
   </div>)
 );

module.exports =  PlacesWithStandaloneSearchBox;
