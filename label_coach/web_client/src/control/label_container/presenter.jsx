import * as React from "react";
import Label from "../label/container";
import "./style.css"

export default class LabelContainerP extends React.Component{
    constructor(props) {
        super(props);

    }

    render() {
        let rows = [];
        if (this.props.labels.length > 0) {
            this.props.labels.forEach((label, i) => {
                rows.push(
                    <li className={"label-item"}>
                        <Label key={label.id} id={label.id} text={label.text} color={label.color} active={label.active}
                               lineButtonState={label.line_button} polyButtonState={label.poly_button}
                               polygons={label.polygons} lines={label.lines}/>
                    </li>
                );
            });
        }
        return (
            <ul className="label-container">
                {rows}
            </ul>
        );
    }
}