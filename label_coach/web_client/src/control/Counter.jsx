import * as React from "react";
import "../styles/Counter.css"

export default class Counter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: this.props.count
        }
    }

    render() {
        return (
            <div className={"badge badge-primary"}>
                <div className={"counter"}>
                    total: {this.state.count}
                </div>
            </div>
        );
    }

}