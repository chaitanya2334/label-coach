import * as React from "react";
import Counter from "../counter/counter";
import "./label.css";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faAngleDown, faAngleUp} from '@fortawesome/free-solid-svg-icons'
import CreatePolyButton from "../create_buttons/poly/container";
import CreateLineButton from "../create_buttons/line/container";
import AnnotationListP from "../annotation_list/presenter";

export default class LabelP extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let faType = this.props.active ? faAngleUp : faAngleDown;
        let activeClass = this.props.active ? "active" : "";

        let count = this.props.polygons.length;

        return (
            <div className={"list-group-item d-flex justify-content-between align-items-center " + this.props.color +
            " " + activeClass}>

                <FontAwesomeIcon icon={faType}/>
                {this.props.text}

                <span className="badge badge-primary badge-pill"> <Counter key={"c_" + this.props.id}
                                                                           count={count}/></span>
                <AnnotationListP key={"ann_" + this.props.id} label_id={this.props.id}
                                 polygons={this.props.polygons} lines={this.props.lines}
                                 color={this.props.id} active={this.props.active}/>
                <CreateLineButton active={this.props.active} label={this.props}
                                  buttonState={this.props.lineButtonState}/>

                <CreatePolyButton active={this.props.active} label={this.props}
                                  buttonState={this.props.polyButtonState}/>
                <div className={"col-sm-1"} onClick={this.props.onClick}>
                    <FontAwesomeIcon icon={faType}/>
                </div>
            </div>
        )
    }
}

