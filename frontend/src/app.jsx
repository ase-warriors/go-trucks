const React = require('react');
const ReactDOM = require('react-dom');
const Home = require('./Home.jsx')

const react_root = document.getElementById('react-root');

if (react_root !== null) {
  const homePage = <Home />;
  ReactDOM.render(homePage, react_root);
}
