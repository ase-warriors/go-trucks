import React from "react";
import { Button } from "react-bootstrap";
import d3 from "d3";

class Start extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const buttonCustomer = (
          <Button>Customer</Button>
        );
        const buttonVendor = (
          <Button>Vendor</Button>
        );
        return (
          <div className="Start">
            <h3>I'm a ...</h3>
            { buttonCustomer }
            { buttonVendor }
          </div>
        );
    }
}

module.exports = Start
            