import React from "react";
const { Navbar, Nav, NavItem, MenuItem, NavDropdown } = require('react-bootstrap');

import d3 from "d3"

class MyNavbar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
      const registerItem = null;
      const logoutItem = null;
      if (props.loggedin === true) {
        registerItem = (<NavItem eventKey={5}>Register</NavItem>);
      } else {
        logoutItem = (<NavItem eventKey={4}>Logout</NavItem >);
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

exports.module = MyNavbar;
