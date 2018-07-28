import * as React from "react";
import "./counter.css";

export default class Counter extends React.Component{
    constructor(props) {
        super(props);
        this.state ={
            count: this.props.count
        }
    }

    render() {
        return (
            <div className={"counter"}>
                total: {this.state.count}
            </div>
        );
    }

}