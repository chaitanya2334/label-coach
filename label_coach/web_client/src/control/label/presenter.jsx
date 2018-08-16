import * as React from "react";
import Counter from "../counter/counter";
import "./style.css";
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
            <div>
                <div className={"container-fluid label " + this.props.color + " " + activeClass} onClick={this.props.onClick}>
                    <div className={"row align-items-center"}>
                        <div className={"col-sm-6 text"}>
                            {this.props.text}<br/>
                            <Counter key={"c_" + this.props.id} count={count}/>
                        </div>
                        <div className={"col-sm-2"}>
                            <CreateLineButton active={this.props.active} label={this.props}
                                              buttonState={this.props.lineButtonState}/>
                        </div>
                        <div className={"col-sm-2"}>
                            <CreatePolyButton active={this.props.active} label={this.props}
                                              buttonState={this.props.polyButtonState}/>
                        </div>

                        <div className={"col-sm-1"}>
                            <FontAwesomeIcon icon={faType} className="icon-size"/>
                        </div>
                    </div>
                </div>
                <AnnotationListP key={"ann_" + this.props.id} label_id={this.props.id} polygons={this.props.polygons}
                                 lines={this.props.lines}
                                 color={this.props.id} active={this.props.active}/>
            </div>

        )
    }
}

