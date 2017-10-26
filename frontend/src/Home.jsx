import React from 'react';
const { Button } = require('react-bootstrap');
const { Navbar, Nav, NavItem, MenuItem, NavDropdown } = require('react-bootstrap')

const Login= require('./login.jsx');

class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      login: ""
    };
    this.userLogin = this.userLogin.bind(this);
    this.onClickLogout = this.onClickLogout.bind(this);
  }
  componentDidMount() {

  }

  userLogin(token) {
    this.setState({
      login: token
    });
  }

  onClickLogout() {
    console.log('loggedout');
    this.setState({
      login: "",
    });
  }
  render() {
    var logoutItem = null;
    var actionItems = null;
    if (this.state.login != "") {
      logoutItem = (<NavItem onClick={this.onClickLogout} eventKey={4}>Logout</NavItem >);
      actionItems = (<NavDropdown eventKey={3} title="Actions" id="basic-nav-dropdown">
                     <MenuItem eventKey={3.1}>Create Posting</MenuItem>
                     <MenuItem eventKey={3.2}>Modify Posting</MenuItem>
                     <MenuItem divider />
                     <MenuItem eventKey={3.3}>Edit Profile</MenuItem>
                     </NavDropdown>);
    }

    const navbarInstance = (
      <Navbar onClick={this.onNavBarEvent}>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">Go Trucks</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
          <NavItem eventKey={1} href="#">Home</NavItem>
          {actionItems}
          <NavItem eventKey={2} href="#">About</NavItem>
          {logoutItem}
        </Nav>
      </Navbar>
    );
    const loginPage = (<Login
                       userLogin={this.userLogin}
                       />);
    if (this.state.login == "") {
      return (
        <div>
          <div>{navbarInstance}</div>
          <div>{loginPage}</div>
        </div>
      );
    } else {
      return (
        <div>
          <div>{navbarInstance}</div>
          <div>You are logged in with token{this.state.login}</div>
        </div>
      );
    }
  }
}

module.exports = Home;
