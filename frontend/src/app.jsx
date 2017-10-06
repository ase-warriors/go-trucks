const React = require('react');
const ReactDOM = require('react-dom');
const Button = require('react-bootstrap').Button;
const d3 = require('d3');

console.log('this is being called');

class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            entries: 0,
        };
        this.addEntry = this.addEntry.bind(this);
    }
    componentDidMount() {
        d3.json('/get', (err, json) => {
            console.log(`we got ${JSON.stringify(json)}`);
            this.setState({entries: json.data});
        });
    }
    addEntry() {
        console.log('database added');
        const current_entries = this.state.entries;
        this.setState({entries: current_entries+1});
        // report an entry addition using POST
        d3.request('/update').post("hello", (err, json) => {
            console.log('we updated!');
        })
    }
    render() {
        return (
            <div id="home-component">
            <h1>Hello Vendor</h1>
            <Button onClick={this.addEntry}>Add Entry</Button>
            <p>{this.state.entries} entries added</p>
            </div>
        );
    }
}

const homePage = <Home />;
const react_root = document.getElementById('react-root');
ReactDOM.render(homePage, react_root)
