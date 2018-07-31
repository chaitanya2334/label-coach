import * as React from "react";
import "./polygon_item.css";

export default class PolygonItemP extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        let subtext = "";
        this.props.points.forEach((point, i)=>{
            subtext += "(" + point.x + ", " + point.y + "), ";
        });
        return (
            <div>
                <div className={"ann-text"}>{this.props.text}</div>
                <div className={"ann-subtext"}> {subtext}</div>
            </div>
        );
    }

}