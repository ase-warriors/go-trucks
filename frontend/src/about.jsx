import React from "react";
const { Jumbotron, Image } = require('react-bootstrap');

class About extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="About">
        <Image src="/static/about.png" responsive />
        <Jumbotron>
          <p>Have you ever wanted to get a quick bite, but not sure where to find the nearest food truck? Or been frustrated that your favorite food truck isn’t at the same spot as last time?</p>
          <p>Fret no more. Go trucks is here to help!</p>
          <p>Our application provides a way for you to find mobile businesses, like food trucks or local farmer’s market stalls, with a simple touch of a button. It makes it easier for customers to find food trucks closest to their current location, by specifying details of each food truck, time of arrival and special menu details that can help you learn more about the vendor.</p>
          <p>Additionally, Go Trucks also provides vendors a way to connect with prospective and loyal customers, by letting them register their services, posting current location, hours and offerings in real-time.</p>
        </Jumbotron>
      </div>
    );
  }
}

module.exports = About;
