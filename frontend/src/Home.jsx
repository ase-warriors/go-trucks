import React from 'react';
const { Navbar, Nav, NavItem, MenuItem, NavDropdown } = require('react-bootstrap')

const Login= require('./login.jsx');
const Create = require('./create.jsx');
const Register = require('./register.jsx');

const d3 = require('d3');
class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      login: "",
      register: false
    };
    this.userLogin = this.userLogin.bind(this);
    this.onClickLogout = this.onClickLogout.bind(this);
    this.onFinishRegister = this.onFinishRegister.bind(this);
    this.onClickRegister = this.onClickRegister.bind(this);
  }
  componentDidMount() {
  }

  userLogin(token) {
    this.setState({
      login: token
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
              });
          window.alert('You have logged out');
        }
      });
  }

  onClickRegister() {
    console.log('register');
    this.setState({
      register: true,
    });
  }

  onFinishRegister() {
    this.setState({
      register:false
    });
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
    const createPage = (<Create token={this.state.login} />);

    const registerPage = (<Register finish={this.onFinishRegister}/>);

    if (this.state.register) {
      return (
        <div>
          <div>{navbarInstance}</div>
          <div>{registerPage}</div>
        </div>
      );
    }

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
          <div>{createPage}</div>
        </div>
      );
    }
  }
}

module.exports = Home;
