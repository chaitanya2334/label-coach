import * as React from "react";
import "./create_button.css";

export default class CreateButtonP extends React.Component{
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }


    onClick(){
        if(this.props.text === "Create"){
            // trigger Create
            this.props.addPoly();
        }else{
            // trigger Cancel
            this.props.cancelPoly();
        }
        this.props.toggleText();
    }

    render() {
        let activeClass = this.props.active ? "active": "";
        return (
            <div className={"create_button " + activeClass}>
                <button type="button" className={"btn btn-primary"} onClick={this.onClick}>{this.props.text}</button>
            </div>
        );
    }

}