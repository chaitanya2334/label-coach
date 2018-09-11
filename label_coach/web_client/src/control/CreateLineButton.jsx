import * as React from "react";
import "../styles/CreateLineButton.css";
import {connect} from "react-redux";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPen, faTimes} from '@fortawesome/free-solid-svg-icons'
import {addAnnotation, cancelAnnotation, postLabels, toggleLabelButton} from "./controlActions";
import "../styles/CreateLineButton.css"
import IconButton from '@material-ui/core/IconButton';



class CreateLineButtonP extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }


    onClick() {
        if (this.props.buttonState) {
            // trigger Create
            this.props.addLine();
        } else {
            // trigger Cancel
            this.props.cancelLine();
        }
        this.props.toggleText();
    }

    render() {
        let activeClass = this.props.active ? "active" : "";
        let faType = this.props.buttonState ? faPen : faTimes;
        return (
            <div className={"create_button active"} onClick={this.onClick}>
                <IconButton className={"icon-button"} aria-label="Delete">
                    <FontAwesomeIcon icon={faType}/>
                </IconButton>
            </div>
        );
    }

}


// ---------- Container ----------
function mapStateToProps(state, ownProps) {
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

const CreateLineButton = connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateLineButtonP);

export default CreateLineButton;