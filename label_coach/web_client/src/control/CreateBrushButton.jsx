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


class CreateBrushButtonP extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }


    onClick() {
        if (this.props.buttonState) {
            // trigger Create
            console.log('trigger create');
            //this.props.addLine();
        } else {
            // trigger Cancel
            console.log('trigger cancel');
            //this.props.cancelLine();
        }
        console.log('toggle');
        //this.props.toggleText();
    }

    render() {
        let activeClass = this.props.active ? "active" : "";
        let faType = this.props.buttonState ? faBrush : faTimes;
        let brush_settings = (
            <Popover id="brush_settings_popover">
                <BrushLabelContainer/>
            </Popover>

            /*
             <div id="brush_settings_popover" role="tooltip" class="fade in popover bottom" style="display: block; top: 84px; left: 649.312px;">
             <div class="arrow" style="left: 50%;"></div>
             <div class="popover-content">
             <strong>This is the brush settings</strong> Check this info.
             </div>
             </div>
             */
        );
        return (
            <OverlayTrigger
                trigger="click"
                rootClose
                placement="bottom"
                overlay={brush_settings}>
                <Button id="home" className="btn-small" size="small"><BrushIcon/></Button>
            </OverlayTrigger>
            /* <div className={"create_button active"} onClick={this.onClick}>
             <IconButton className={"icon-button"} aria-label="Delete">
             <FontAwesomeIcon icon={faType}/>
             </IconButton>
             </div>*/
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