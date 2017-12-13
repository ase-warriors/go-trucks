const Nightmare = require('nightmare');
const { expect } = require('chai');
const url = "http://127.0.0.1:5000/";

describe('Testing Go Trucks as a vendor', function () {
  this.timeout('5s')
  const email = `${Math.random()}@{gotruck.com}`
  const password = `${Math.random()}`;
  let nightmare = null
  beforeEach(() => {
    nightmare = new Nightmare();
  })

  it('should load the vendor page', done => {
    nightmare
      .goto(url)
      .wait('ul.nav')
      .click('a#vendor-portal')
      .wait('div.Login h3')
      .evaluate(() => document.querySelector('div.Login h3').innerHTML)
      .end()
      .then((result) => {
        expect(result).to.equal('Vendor Login')
        done();
      })
      .catch(done);
  })

  it('should contain the login form', done => {
    nightmare
      .goto(url)
      .wait('ul.nav')
      .click('a#vendor-portal')
      .wait('div.Login form')
      .evaluate(() => document.querySelector('div.Login form').children.length)
      .end()
      .then(result => {
        expect(result).to.equal(3)
        done();
      })
      .catch(done);
  })

  it('should contain the registration form', done => {
    nightmare
      .goto(url)
      .wait('ul.nav')
      .click('a#vendor-portal')
      .wait('div.Register form')
      .evaluate(() => document.querySelector('div.Register form').children.length)
      .end()
      .then(result => {
        expect(result).to.equal(5)
        done();
      })
      .catch(done);
  })

  it('attempt to register', done => {
    nightmare
      .goto(url)
      .wait('ul.nav')
      .click('a#vendor-portal')
      .wait('input#register-email')
      .on('page', function(type, message) {
        console.log(type + message);
        done();
      })
      .evaluate(() => document.querySelector("input#register-email").type)
      .insert("input#register-email", "hello@worldcc.com")
      .insert("input#register-password", "123")
      .insert("input#register-repassword", "123")
      .pdf(email+".pdf")
      .click('button#register-submit')
      .end()
      .then(result => {
        done()
      })
      .catch(done)
  })

  it('attempt to login to the vendor page', done => {
    nightmare
      .goto(url)
      .wait('ul.nav')
      .click('a#vendor-portal')
      .wait('input#login-email')
      .on('page', function(type, message) {
        console.log(type + message);
        done();
      })
      .evaluate(() => document.querySelector("input#login-email").type)
      .insert("input#login-email", "hello@worldcc.com")
      .insert("input#login-password", "123")
       .pdf(email+".pdf")
      .click('button#login-submit')
      .end()
      .then(result => {
        done()
      })
      .catch(done)
  })

})

describe('Testing Go Trucks as a customer', function () {
  this.timeout('5s')
  let nightmare = null
  beforeEach(() => {
    nightmare = new Nightmare();
  })

  it('should load the home page', done => {
    nightmare
      .goto(url)
      .end()
      .then((result) => {
        expect(result.code).to.equal(200);
        done();
      })
      .catch(done);
  })

  it('should list nearby vendors in a table', done => {
    nightmare
      .goto(url)
      .wait('#post-list-table')
      .evaluate(() => document.querySelector('#post-list-table table thead tr th').innerHTML)
      .end()
      .then((content) => {
        expect(content).to.equal('Results');
        done();
      })
      .catch(done);
  })

  it('should render a list of vendors in Google Map', done => {
    nightmare
      .goto(url)
      .wait('.gm-style')
      .end()
      .then(() => {
        done();
      })
      .catch(done);
  })

})


