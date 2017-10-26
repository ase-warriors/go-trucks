import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const React = require('react');
const ReactDOM = require('react-dom');
const Home = require('./Home.jsx')

const react_root = document.getElementById('go-trucks-app');

if (react_root !== null) {
  const homePage = <Home />;

  const App = () => (
    <MuiThemeProvider>
      homePage
    </MuiThemeProvider>
  );
  ReactDOM.render(homePage, react_root);
}
