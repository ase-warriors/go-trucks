const React = require('react');
const Button = require('react-bootstrap').Button;
const d3 = require('d3');

class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            entries: 0,
        };
        this.addEntry = this.addEntry.bind(this);
    }
    componentDidMount() {
    }
    addEntry() {
        const current_entries = this.state.entries;
        this.setState({entries: current_entries+1});
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

module.exports = Home;
