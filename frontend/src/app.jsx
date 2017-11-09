import Home from './home.jsx';
const React = require('react');
const ReactDOM = require('react-dom');

const react_root = document.getElementById('go-trucks-app');

if (react_root !== null) {
  const homePage = <Home />;
  ReactDOM.render(homePage, react_root);
  const myName = "Andy";
  console.log(`Hello ${myName}`);
}
