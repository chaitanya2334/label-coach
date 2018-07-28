import * as React from "react";

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
                {this.state.count}
            </div>
        );
    }

}