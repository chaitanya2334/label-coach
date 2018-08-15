import * as React from "react";
import "./style.css";
import fontawesome from '@fortawesome/fontawesome'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPen, faTimes} from '@fortawesome/free-solid-svg-icons'


export default class CreateLineButtonP extends React.Component{
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }


    onClick(){
        if(this.props.buttonState){
            // trigger Create
            this.props.addLine();
        }else{
            // trigger Cancel
            this.props.cancelLine();
        }
        this.props.toggleText();
    }

    render() {
        let activeClass = this.props.active ? "active": "";
        let faType = this.props.buttonState ? faPen: faTimes;
        return (
            <div className={"create_button " + activeClass}>
                <button type="button" className={"btn btn-primary"} onClick={this.onClick}><FontAwesomeIcon icon={faType}/></button>
            </div>
        );
    }

}