import * as React from "react";
import "../styles/CreateBrushButton.css";
import {connect} from "react-redux";
import {addAnnotation, cancelAnnotation, toggleLabelButton} from "./controlActions";
import "../styles/CreateLineButton.css"
import BrushIcon from "@material-ui/icons/Brush";

import ToggleButton from "@material-ui/lab/ToggleButton";


class CreateBrushButtonP extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ToggleButton id="brush" value="brush" className="btn-small" size="small"><BrushIcon/></ToggleButton>
        );
    }

}


// ---------- Container ----------
function mapStateToProps(state, ownProps) {
    console.log('print state');
    console.log(state);
    console.log(ownProps);
    return state;
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        addLine: () => {
            dispatch(addAnnotation("line", ownProps.label.id));
        },
        cancelLine: () => {
            dispatch(cancelAnnotation("line", ownProps.label.id));
        },
        toggleText: () => {
            dispatch(toggleLabelButton(ownProps.label.id, "line_button"))
        }
    }
}

const CreateBrushButton = connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateBrushButtonP);

export default CreateBrushButton;