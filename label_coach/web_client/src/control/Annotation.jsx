import * as React from "react";
import "./annotation.css";

export default class Annotation extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            text: this.props.text,
            points: this.props.points
        }
    }

    render() {
        let subtext = "";
        this.state.points.forEach((point, i)=>{
            subtext += "(" + point.x + ", " + point.y + "), ";
        });
        return (
            <div>
                <div className={"ann-text"}>{this.state.text}</div>
                <div className={"ann-subtext"}> {subtext}</div>
            </div>
        );
    }

}