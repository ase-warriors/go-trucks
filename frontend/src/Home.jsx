import React from 'react';
const { Button } = require('react-bootstrap');
const { Navbar, Nav, NavItem, MenuItem, NavDropdown } = require('react-bootstrap')

const Login= require('./login.jsx');

class Home extends React.Component {
  constructor() {
        super();
  }
  componentDidMount() {
  }
  render() {
    const navbarInstance = (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">Go Trucks</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
          <NavItem eventKey={1} href="#">Home</NavItem>
          <NavDropdown eventKey={3} title="Actions" id="basic-nav-dropdown">
            <MenuItem eventKey={3.1}>Create Posting</MenuItem>
            <MenuItem eventKey={3.2}>Modify Posting</MenuItem>
            <MenuItem eventKey={3.3}>Edit Profile</MenuItem>
            <MenuItem divider />
            <MenuItem eventKey={3.4}>Separated link</MenuItem>
          </NavDropdown>
          <NavItem eventKey={2} href="#">About</NavItem>
        </Nav>
      </Navbar>
    );
    const loginPage = (<Login />);
    return (
      <div>
        <div>{navbarInstance}</div>
        <div>{loginPage}</div>
      </div>
    );
  }
}

module.exports = Home;
