import * as React from "react";
import Annotation from "./Annotation";
import "./annotations.css";

export default class Annotations extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            index: this.props.index,
            anns: this.props.anns,
            color: this.props.color,
            active: this.props.active
        }
    }

    render() {
        let colorClass = "bg-color" + this.state.color;
        let activeClass = this.props.active ? "active": "";
        let rows = [];
        if (this.state.anns.length > 0) {
            this.state.anns.forEach((ann, i) => {
                rows.push(<Annotation key={this.state.index + "_" + i} id={"Annotation_" + i} text={ann.text} points={ann.points}/>);
            });
        }

        return (
            <div className={"annotations " + colorClass + " " + activeClass}>
                {rows}
            </div>
        );
    }

}