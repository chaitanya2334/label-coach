import * as React from "react";
import "./style.css";

export default class LineItemP extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let subtext = "";
        this.props.points.forEach((point, i) => {
            subtext += "(" + parseInt(point.x) + ", " + parseInt(point.y) + "), ";
        });
        return (
            <div className={"line_item"}>
                <div className={"row no-gutters align-items-center"}>
                    <div className={"col-sm-9"}>
                        <div className={"ann-text"}>{this.props.text}</div>
                        <div className={"ann-subtext"}>{subtext}</div>
                    </div>
                    <div className={"col-sm-3"}>
                        <LineButton doneLine={this.props.doneLine} doneCreateLine={this.props.doneCreateLine} editPoly={this.props.editLine}
                                    label_id={this.props.label_id} line_id={this.props.line_id}
                                    drawState={this.props.drawState}/>
                    </div>

                </div>
            </div>
        );
    }
}

class LineButton extends React.Component {
    constructor(props) {
        super(props);
        this.updateText();
        this.onClick = this.onClick.bind(this);
    }

    updateText() {
        if (this.props.drawState === "edit" || this.props.drawState === "create") {
            this.text = "Done";
        } else {
            this.text = "Edit";
        }
    }

    onClick() {
        if (this.props.drawState === "edit" ) {
            this.props.doneLine(this.props.label_id, this.props.line_id);

        } else if(this.props.drawState === "create"){
            this.props.doneCreateLine(this.props.label_id, this.props.line_id);
        }
        else if (this.props.drawState === "read-only") {
            this.props.editLine(this.props.label_id, this.props.line_id);
        }

    }

    render() {
        this.updateText();
        return (
            <div className={"line_button"}>
                <button type="button" className={"btn btn-primary"} onClick={this.onClick}>{this.text}</button>
            </div>
        );
    }

}