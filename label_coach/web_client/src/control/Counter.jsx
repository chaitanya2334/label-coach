import * as React from "react";
import "../styles/Counter.css"

export default class Counter extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (

            <span className="counter"> {this.props.count}</span>

        );
    }

}