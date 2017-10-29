import React from "react";
const { Navbar, Nav, NavItem, MenuItem, NavDropdown } = require('react-bootstrap');

import d3 from "d3"

class MyNavbar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
      var registerItem = null;
      var logoutItem = null;
      if (this.props.loggedin === true) {
        logoutItem = (<NavItem onClick={this.props.onClickLogout} eventKey={4}>Logout</NavItem >);
      } else {
        registerItem = (<NavItem onClick={this.props.onClickRegister} eventKey={5}>Register</NavItem>);
      }

      const navbarInstance = (
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="/">Go Trucks</a>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav>
            <NavItem eventKey={2} href="#">About</NavItem>
            {registerItem}
            {logoutItem}
          </Nav>
        </Navbar>
      );

      return navbarInstance;
    }
}
module.exports = MyNavbar;
