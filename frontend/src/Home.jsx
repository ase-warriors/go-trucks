import React from 'react';
const { Navbar, Nav, NavItem, MenuItem, NavDropdown } = require('react-bootstrap');

const Login= require('./login.jsx');
const Create = require('./create.jsx');
const Register = require('./register.jsx');
const Start = require('./start.jsx');

const d3 = require('d3');
class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      login: "",
      vendorID: "",
      registerlogin: false
    };

    if (document.cookie !== "") {
      const userInfo = JSON.parse(document.cookie);
      console.log(JSON.stringify(document.cookie));
      this.state.login = userInfo.login;
      this.state.vendorID = userInfo.vendorID;
    }
    this.userLogin = this.userLogin.bind(this);
    this.onClickLogout = this.onClickLogout.bind(this);
    this.onFinishRegister = this.onFinishRegister.bind(this);
    this.onClickRegister = this.onClickRegister.bind(this);
    this.onUserChooseRole = this.onUserChooseRole.bind(this);
  }
  componentDidMount() {
  }

  userLogin(token, vendor_id) {
    this.setState({
      login: token,
      vendorID: vendor_id,
      registerlogin: false,
    });

    // save to cookie
    document.cookie = JSON.stringify({
      login: token,
      vendorID: vendor_id,
    });
  }

  onClickLogout() {
    console.log('logging out');
    d3.request("/auth/logout")
      .header("X-Requested-With", "XMLHttpRequest")
      .header("Content-Type", "application/x-www-form-urlencoded")
      .header("Authorization", this.state.login)
      .post('', (res) => {
        if(res == null) {
          window.alert('logout failure');
          return;
        }
        const parsedMessage = JSON.parse(res.response);
        console.log(parsedMessage)
        if (parsedMessage.status == "success"){
              this.setState({
                login: "",
                vendorID: "",
              });
          // clean the cookie
          document.cookie = ""
          window.alert('You have logged out');
        }
      });
  }

  onClickRegister() {
    console.log('register');
    this.setState({
      registerlogin: true,
    });
  }

  onFinishRegister() {
    this.setState({
      registerlogin:false,
    });
  }

  onUserChooseRole(role) {
    if (role == 0) {
      // vendor role
      this.setState({
        registerlogin: true,
      });
      // goto login page
    } else {
      // go to customer page
    }
  }
  render() {
    var logoutItem = null;
    var actionItems = null;
    var registerItem = null;
    if (this.state.login != "") {
      logoutItem = (<NavItem onClick={this.onClickLogout} eventKey={4}>Logout</NavItem >);
      actionItems = (<NavDropdown eventKey={3} title="Actions" id="basic-nav-dropdown">
                     <MenuItem eventKey={3.1}>Create Posting</MenuItem>
                     <MenuItem eventKey={3.2}>Modify Posting</MenuItem>
                     <MenuItem divider />
                     <MenuItem eventKey={3.3}>Edit Profile</MenuItem>
                     </NavDropdown>);
    } else {
      registerItem = (<NavItem onClick={this.onClickRegister} eventKey={5}>Register</NavItem>);
      console.log("register item added")
    }
    
    const navbarInstance = (
      <Navbar onClick={this.onNavBarEvent}>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/">Go Trucks</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
          {actionItems}
          <NavItem eventKey={2} href="#">About</NavItem>
          {registerItem}
          {logoutItem}
        </Nav>
      </Navbar>
    );
    const loginPage = (<Login
                       userLogin={this.userLogin}/>);
    const createPage = (<Create token={this.state.login} vendorID={this.state.vendorID}/>);

    const registerPage = (<Register finish={this.onFinishRegister}/>);

    const startPage = (<Start onUserChooseRole={this.onUserChooseRole}/>);

    if (this.state.registerlogin) {
      return (
        <div>
          <div>{navbarInstance}</div>
          <div>{loginPage}</div>
          <div>{registerPage}</div>
        </div>
      );
    }

    if (this.state.login == "") {
      return (
        <div>
          <div>{navbarInstance}</div>
          <div>{startPage}</div>
        </div>
      );
    } else {
      return (
        <div>
          <div>{navbarInstance}</div>
          <div>{createPage}</div>
        </div>
      );
    }
  }
}

module.exports = Home;
