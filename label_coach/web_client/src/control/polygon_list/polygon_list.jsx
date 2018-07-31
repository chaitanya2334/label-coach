import * as React from "react";
import PolygonItem from "../polygon_item/container";
import "./polygon_list.css";

export default class PolygonList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let colorClass = "bg-color" + this.props.color;
        let activeClass = this.props.active ? "active": "";
        let rows = [];
        if (this.props.polygonList.length > 0) {
            this.props.polygonList.forEach((polygon, i) => {
                rows.push(<PolygonItem key={this.props.index + "_" + i} id={"Annotation_" + i} text={polygon.text} points={polygon.points}/>);
            });
        }

        return (
            <div className={"annotations " + colorClass + " " + activeClass}>
                {rows}
            </div>
        );
    }

}