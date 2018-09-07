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
        let collapse = this.props.collapse ? "collapse" : "";
        let areaexpand = this.props.areaexpand ? "true" : "false";

        console.log(this.props.polygons.length + this.props.lines.length);

        return (


            <div className="card">
                <div  className={"card-header " + this.props.color + " " + activeClass} id={"heading_"+this.props.name}>
                  <h5 className="mb-0">
                    <span onClick={this.props.onClick}> <FontAwesomeIcon icon={faType} className="icon-size"/> </span>
                    <a  onClick={this.props.onClick} data-toggle={collapse} data-target={"#collapse_"+this.props.name} aria-expanded={areaexpand} aria-controls={"#collapse_"+this.props.name}>
                      {this.props.name}
                    </a>

                            <CreateLineButton active={this.props.active} label={this.props}
                                              buttonState={this.props.lineButtonState}/>

                            <CreatePolyButton active={this.props.active} label={this.props}
                                              buttonState={this.props.polyButtonState}/>

                    <span className={"badge badge-pill badge-secondary float-right"}><Counter key={"c_" + this.props.id} count={this.props.polygons.length + this.props.lines.length}/>
                        </span>
                  </h5>
                </div>

                <div id={"collapse_"+this.props.name} className={"collapse show "+ collapse} aria-labelledby={"heading_"+this.props.name} >
                  <div className="card-body">
                    <AnnotationListP key={"ann_" + this.props.id} label_id={this.props.id} polygons={this.props.polygons}
                                 lines={this.props.lines}
                                 color={this.props.id} active={this.props.active}/> </div>
                </div>
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