import React from 'react';

const Login= require('./vendor/login.jsx');
const Create = require('./vendor/create.jsx');
const Register = require('./vendor/register.jsx');
const View = require('./customer/view.jsx')
const MyNavbar = require('./mynavbar.jsx');
const About = require('./about.jsx');

const d3 = require('d3');
class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      login: "",
      vendorID: "",
      registerlogin: false,
      vendorViewAsCustomer: false,
      aboutPage: false,
    };

    if (document.cookie !== "") {
      const userInfo = JSON.parse(document.cookie);
      console.log(JSON.stringify(document.cookie));
      this.state.login = userInfo.login;
      this.state.vendorID = userInfo.vendorID;
    }
    this.onUserLogin = this.onUserLogin.bind(this);
    this.onClickLogout = this.onClickLogout.bind(this);
    this.onFinishRegister = this.onFinishRegister.bind(this);
    this.onClickRegister = this.onClickRegister.bind(this);
    this.onClickToggleVendorViewAsCustomer =
      this.onClickToggleVendorViewAsCustomer.bind(this);
    this.onClickToggleAboutPage =
      this.onClickToggleAboutPage.bind(this);
  }
  componentDidMount() {
    return
  }

  onUserLogin(token, vendor_id) {
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

  onClickToggleVendorViewAsCustomer() {
    const b = this.state.vendorViewAsCustomer;
    this.setState({vendorViewAsCustomer: !b});
  }

  onClickToggleAboutPage() {
    const b = this.state.aboutPage;
    this.setState({aboutPage: !b});
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
          document.cookie=""//clear anyways
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

  render() {
    var logoutItem = null;
    var actionItems = null;
    var registerItem = null;
    const navbarInstance = (<MyNavbar key={4} loggedin={this.state.login === "" ? false : true} onClickLogout={this.onClickLogout} onClickRegister={this.onClickRegister} onClickToggleVendorViewAsCustomer={this.onClickToggleVendorViewAsCustomer} viewAsCustomer={this.state.vendorViewAsCustomer} onClickToggleAboutPage={this.onClickToggleAboutPage}/>);
    const loginPage = (<Login key={0}
                       onUserLogin={this.onUserLogin}/>);
    const createPage = (<Create key={1} token={this.state.login} vendorID={this.state.vendorID}/>);

    const registerPage = (<Register key={2} finish={this.onFinishRegister}/>);

    const viewPage = (<View key={5}/>);
    const aboutPage = (<About key={6}/>);
    const pageElements = [];

    pageElements.push(navbarInstance);
    console.log(this.state)

    if (this.state.aboutPage) {
      pageElements.push(aboutPage);
    }
    else if (this.state.registerlogin) {
      const registerLoginPage = (
        <div key={5}>
          {loginPage}
          {registerPage}
        </div>
      );
      pageElements.push(registerLoginPage);
    } else if (this.state.login == "" || this.state.vendorViewAsCustomer) { // direct to customer
      pageElements.push(viewPage);
    } else { // direct to vendor
      pageElements.push(createPage);
    }

    return (<div className="Home">
            {pageElements}
            </div>);
  }
}


module.exports = Home;
