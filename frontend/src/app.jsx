/* eslint-env browser */
const React = require('react');
const ReactDOM = require('react-dom');
const Home = require('./home.jsx');

const react_root = document.getElementById('go-trucks-app');

if (react_root !== null) {
  const homePage = <Home />;
  ReactDOM.render(homePage, react_root);
}
