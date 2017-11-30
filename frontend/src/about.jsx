import React from "react";
const { Well } = require('react-bootstrap');

class About extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="About">
        <Well>About Us</Well>
      </div>
    );
  }
}

module.exports = About;
