import React from 'react';

const Login= require('./vendor/login.jsx');
const Create = require('./vendor/create.jsx');
const Register = require('./vendor/register.jsx');
const Start = require('./start.jsx');
const MyNavbar = require('./mynavbar.jsx');

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
    const navbarInstance = (<MyNavbar key={4} loggedin={this.state.login === "" ? false : true} onClickLogout={this.onClickLogout} onClickRegister={this.onClickRegister}/>);
    const loginPage = (<Login key={0}
                       userLogin={this.userLogin}/>);
    const createPage = (<Create key={1} token={this.state.login} vendorID={this.state.vendorID}/>);

    const registerPage = (<Register key={2} finish={this.onFinishRegister}/>);


    const startPage = (<Start key={3} onUserChooseRole={this.onUserChooseRole}/>);

    const pageElements = [];
    pageElements.push(navbarInstance);

    if (this.state.registerlogin) {
      const registerLoginPage = (
        <div key={5}>
          {loginPage}
          {registerPage}
        </div>
      );
      pageElements.push(registerLoginPage);
    } else if (this.state.login == "") {
      pageElements.push(startPage);
    } else {
      pageElements.push(createPage);
    }

    return (<div className="Home">
            {pageElements}
            </div>);
  }
}


module.exports = Home;
