import * as React from "react";
import "../styles/CreateBrushButton.css";
import {connect} from "react-redux";

import {faBrush, faTimes} from '@fortawesome/free-solid-svg-icons'
import {addAnnotation, cancelAnnotation, toggleLabelButton} from "./controlActions";
import "../styles/CreateLineButton.css"
import BrushIcon from "@material-ui/icons/Brush";
import {OverlayTrigger, Popover} from "react-bootstrap";
import {BrushLabelContainer} from "./BrushLabelContainer";
import Button from "@material-ui/core/Button";
import ToggleButton from "@material-ui/lab/ToggleButton";


class CreateBrushButtonP extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    render() {
        let brush_settings = (
            <Popover id="brush_settings_popover">
                <BrushLabelContainer/>
            </Popover>
        );
        return (
            <OverlayTrigger
                trigger="click"
                rootClose
                placement="bottom"
                overlay={brush_settings}>
                <ToggleButton id="home" className="btn-small" size="small"><BrushIcon/></ToggleButton>
            </OverlayTrigger>

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