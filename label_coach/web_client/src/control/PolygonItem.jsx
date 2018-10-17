import * as React from "react";
import "../styles/PolygonItem.css";
import {connect} from "react-redux";
import {lockAnnotation, setSaveStatus, toggleLabelButton, unlockAnnotation} from "./controlActions";
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import DeleteIcon from "@material-ui/icons/Delete";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import IconButton from "@material-ui/core/IconButton";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

class PolygonItemP extends React.Component {
    constructor(props) {
        super(props);
    }

    onEdit(){
        this.props.editPoly(this.props.label_id, this.props.poly_id);
    }

    onDelete(){
        this.props.deletePoly(this.props.label_id, this.props.poly_id);
    }

    render() {
        let subtext = "";
        this.props.points.forEach((point, i) => {
            subtext += "(" + parseInt(point.x) + ", " + parseInt(point.y) + "), ";
        });
        return (
            <ListItem button>
                <ListItemText primary={this.props.text} secondary={subtext}/>
                <IconButton type="button" onClick={this.onClick}>
                    <FontAwesomeIcon icon={faEdit}/>
                </IconButton>
                <IconButton type="button" onClick={this.onClick}>
                    <DeleteIcon/>
                </IconButton>

            </ListItem>
        );
    }
}

class PolyButton extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        if (this.props.drawState === "edit") {
            this.props.donePoly(this.props.label_id, this.props.poly_id);

        } else if (this.props.drawState === "create") {
            this.props.doneCreatePoly(this.props.label_id, this.props.poly_id);
        }
        else if (this.props.drawState === "read-only") {
            this.props.editPoly(this.props.label_id, this.props.poly_id);
        }

    }

    render() {
        return (
            <div className={"poly_button"}>

            </div>
        );
    }

}

// ---------- Container ----------

function mapStateToProps(state) {
    return state;
}

function mapDispatchToProps(dispatch) {
    return {
        editPoly: (label_id, poly_id) => {
            dispatch(unlockAnnotation("polygon", label_id, poly_id))
        },
        donePoly: (label_id, poly_id) => {
            dispatch(lockAnnotation("polygon", label_id, poly_id));
            dispatch(setSaveStatus("dirty"));
        },
        doneCreatePoly: (label_id, poly_id) => {
            dispatch(lockAnnotation("polygon", label_id, poly_id));
            dispatch(setSaveStatus("dirty"));
            dispatch(toggleLabelButton(label_id, "poly_button"));
        }
    };
}

const PolygonItem = connect(
    mapStateToProps,
    mapDispatchToProps
)(PolygonItemP);

export default PolygonItem;