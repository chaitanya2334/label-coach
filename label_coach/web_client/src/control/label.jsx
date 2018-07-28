import * as React from "react";
import Counter from "./counter";
import Annotations from "./annotations";
import "./label.css";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faAngleDown, faAngleUp} from '@fortawesome/free-solid-svg-icons'

export default class Label extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            index: this.props.index,
            active: this.props.active,
            text: this.props.text,
            count: this.props.count, // the total number of annotations collected so far for this label
            anns: this.props.anns
        }
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        this.setState(prevState => ({
            active: !prevState.active
        }));
    }

    render() {
        let colorClass = 'color' + this.state.index;
        let faType = this.state.active ? faAngleUp : faAngleDown;
        let activeClass = this.state.active ? "active" : "";

        return (
            <div className={"label"} onClick={this.onClick}>
                <div className={"container-fluid side-vert-bar " + colorClass + " " + activeClass}>
                    <div className={"row align-items-center"}>
                        <div className={"col-sm-10 text"}>
                            {this.state.text}
                            <Counter key={"c_" + this.state.index} count={this.state.count}/>
                        </div>


                        <div className={"col-sm-1"}>
                            <FontAwesomeIcon icon={faType}/>
                        </div>
                    </div>
                </div>
                <Annotations key={"ann_" + this.state.index} index={"ann_" + this.state.index} anns={this.state.anns}
                             color={this.state.index} active={this.state.active}/>
            </div>
        )
    }
}