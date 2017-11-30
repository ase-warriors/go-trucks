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
      var toggleVendorViewAsCustomerItem = null;
      if (this.props.loggedin === true) {
        logoutItem = (<NavItem onClick={this.props.onClickLogout} eventKey={4}>Logout</NavItem >);
        var key = "Customer View";
        if (this.props.viewAsCustomer) {
          key = "Vendor View";
        }
        toggleVendorViewAsCustomerItem = (<NavItem onClick={this.props.onClickToggleVendorViewAsCustomer} eventKey={6}>{key}</NavItem>)
      } else {
        registerItem = (<NavItem id="vendor-portal" onClick={this.props.onClickRegister} eventKey={5}>Vendor Portal</NavItem>);
      }

      if (this.props.inAbout) {
        registerItem = null;
        logoutItem = null;
        toggleVendorViewAsCustomerItem = null;
      }
      const navbarInstance = (
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="/">Go Trucks</a>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav>
            <NavItem eventKey={2} onClick={this.props.onClickToggleAboutPage}>About</NavItem>
            {registerItem}
            {toggleVendorViewAsCustomerItem}
            {logoutItem}
          </Nav>
        </Navbar>
      );

      return navbarInstance;
    }
}
module.exports = MyNavbar;
