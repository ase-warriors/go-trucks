const React = require('react');
const { Navbar, Nav, NavItem } = require('react-bootstrap');

class MyNavbar extends React.Component {
  render() {
    let registerItem = null;
    let logoutItem = null;
    let toggleVendorViewAsCustomerItem = null;
    if (this.props.loggedin) {
      logoutItem = (<NavItem onClick={this.props.onClickLogout} eventKey={4}>Logout</NavItem >);
      let key = 'Customer View';
      if (this.props.viewAsCustomer) {
        key = 'Vendor View';
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
