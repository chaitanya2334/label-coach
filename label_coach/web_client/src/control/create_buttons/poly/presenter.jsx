import * as React from "react";
import "./style.css";
import fontawesome from '@fortawesome/fontawesome'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faDrawPolygon, faTimes} from '@fortawesome/free-solid-svg-icons'

fontawesome.library.add(faDrawPolygon);

export default class CreatePolyButtonP extends React.Component{
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }


    onClick(){
        if(this.props.buttonState){
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
        let faType = this.props.buttonState ? "draw-polygon": faTimes;
        return (
            <div className={"create_button " + activeClass}>
                <button type="button" className={"btn btn-primary"} onClick={this.onClick}><FontAwesomeIcon icon={faType}/></button>
            </div>
        );
    }

}