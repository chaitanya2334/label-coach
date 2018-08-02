import * as React from "react";
import "./polygon_item.css";

export default class PolygonItemP extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let subtext = "";
        this.props.points.forEach((point, i) => {
            subtext += "(" + parseInt(point.x) + ", " + parseInt(point.y) + "), ";
        });
        return (
            <div className={"poly_item"}>
                <div className={"row no-gutters align-items-center"}>
                    <div className={"col-sm-9"}>
                        <div className={"ann-text"}>{this.props.text}</div>
                        <div className={"ann-subtext"}>{subtext}</div>
                    </div>
                    <div className={"col-sm-3"}>
                        <PolyButton donePoly={this.props.donePoly} doneCreatePoly={this.props.doneCreatePoly} editPoly={this.props.editPoly}
                                    label_id={this.props.label_id} poly_id={this.props.poly_id}
                                    drawState={this.props.drawState}/>
                    </div>

                </div>
            </div>
        );
    }
}

class PolyButton extends React.Component {
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
            this.props.donePoly(this.props.label_id, this.props.poly_id);

        } else if(this.props.drawState === "create"){
            this.props.doneCreatePoly(this.props.label_id, this.props.poly_id);
        }
        else if (this.props.drawState === "read-only") {
            this.props.editPoly(this.props.label_id, this.props.poly_id);
        }

    }

    render() {
        this.updateText();
        return (
            <div className={"poly_button"}>
                <button type="button" className={"btn btn-primary"} onClick={this.onClick}>{this.text}</button>
            </div>
        );
    }

}