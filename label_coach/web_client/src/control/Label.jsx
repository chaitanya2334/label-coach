import * as React from "react";
import {faAngleDown, faAngleUp} from '@fortawesome/free-solid-svg-icons'
import {connect} from "react-redux";
import AnnotationListP from "./AnnotationList";
import Counter from "./Counter";
import "../styles/Label.css"
import {toggleLabel} from "./controlActions";

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


            <div className="lbl-card" >
                <div className={"card-header " + activeClass}
                     onClick={this.props.onClick}
                     id={"heading_" + this.props.name}>
                    <div className={"lbl-text"}>
                        <div className={"lbl-dot"} style={{backgroundColor: this.props.color}}/>
                        <p>{this.props.name}</p>
                        <Counter key={"c_" + this.props.id}
                                 count={this.props.polygons.length + this.props.lines.length}/>

                    </div>
                </div>

                <div id={"collapse_" + this.props.name} className={"collapse show " + collapse}
                     aria-labelledby={"heading_" + this.props.name}>
                    <div className="card-body">
                        <AnnotationListP key={"ann_" + this.props.id}
                                         label_id={this.props.id}
                                         polygons={this.props.polygons}
                                         lines={this.props.lines}
                                         color={this.props.id}
                                         active={this.props.active}/>
                    </div>
                </div>
            </div>


        )
    }
}

// ---------- Container ----------

function mapStateToProps(state) {
    return state
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        onClick: () => {
            dispatch(toggleLabel(ownProps))
        }
    }
}

const Label = connect(
    mapStateToProps,
    mapDispatchToProps
)(LabelP);

export default Label;