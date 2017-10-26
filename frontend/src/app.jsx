import Home from './Home.jsx';
const React = require('react');
const ReactDOM = require('react-dom');

const react_root = document.getElementById('go-trucks-app');

if (react_root !== null) {
  const loginPage = <Home />;
  ReactDOM.render(loginPage, react_root);
}
