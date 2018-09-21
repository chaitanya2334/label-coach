import * as React from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faAngleDown, faAngleUp} from '@fortawesome/free-solid-svg-icons'
import {connect} from "react-redux";
import AnnotationListP from "./AnnotationList";
import Counter from "./Counter";
import "../styles/BrushLabel.css"
import {toggleLabel} from "./controlActions";
import CreateLineButton from "./CreateLineButton";
import CreatePolyButton from "./CreatePolyButton";

class BrushLabelP extends React.Component {
    constructor(props) {
        super(props);
    }

    onClick() {
        Console.log(this.props.name);
    }

    render() {
        let activeClass = this.props.active ? "active" : "";


        return (
            <span className={"dot " + activeClass}
                  id={"brush_" + this.props.name}
                  onClick={this.props.onClick}
                  style={{backgroundColor: this.props.color}}>
            </span>
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

const BrushLabel = connect(
    mapStateToProps,
    mapDispatchToProps
)(BrushLabelP);

export default BrushLabel;