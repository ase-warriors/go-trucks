const Nightmare = require('nightmare');
const { expect } = require('chai');
const url = "http://127.0.0.1:5000/";

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
        expect(content).to.equal('Vendor #');
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
