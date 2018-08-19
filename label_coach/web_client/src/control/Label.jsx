import * as React from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faAngleDown, faAngleUp} from '@fortawesome/free-solid-svg-icons'
import {connect} from "react-redux";
import AnnotationListP from "./AnnotationList";
import Counter from "./Counter";
import "../styles/Label.css"
import {toggleLabel} from "./controlActions";
import CreateLineButton from "./CreateLineButton";
import CreatePolyButton from "./CreatePolyButton";

class LabelP extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let faType = this.props.active ? faAngleUp : faAngleDown;
        let activeClass = this.props.active ? "active" : "";

        console.log(this.props.polygons.length + this.props.lines.length);

        return (
            <div>
                <div className={"container-fluid label " + this.props.color + " " + activeClass} >
                    <div className={"row align-items-center"}>
                        <div className={"col-sm-6 text"} onClick={this.props.onClick}>
                            {this.props.name}<br/>
                            <Counter key={"c_" + this.props.id} count={this.props.polygons.length + this.props.lines.length}/>
                        </div>
                        <div className={"col-sm-2"}>
                            <CreateLineButton active={this.props.active} label={this.props}
                                              buttonState={this.props.lineButtonState}/>
                        </div>
                        <div className={"col-sm-2"}>
                            <CreatePolyButton active={this.props.active} label={this.props}
                                              buttonState={this.props.polyButtonState}/>
                        </div>

                        <div className={"col-sm-1"} onClick={this.props.onClick}>
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

// ---------- Container ----------

function mapStateToProps(state){
    return state
}

function mapDispatchToProps(dispatch, ownProps){
    return {
        onClick: ()=>{dispatch(toggleLabel(ownProps))}
    }
}

const Label = connect(
    mapStateToProps,
    mapDispatchToProps
)(LabelP);

export default Label;