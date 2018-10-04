import * as React from "react";
import {connect} from "react-redux";
import "../styles/BrushLabel.css"
import {selectLabel, unlockAnnotation} from "./controlActions";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

class BrushLabelP extends React.Component {
    constructor(props) {
        super(props);
    }

    onClick() {
        Console.log(this.props.name);
    }

    render() {
        return (
            <ListItem button divider selected={this.props.active} onClick={this.props.selectLabel}>
                <ListItemIcon>
                    <div className={"dot"} id={"brush_" + this.props.name} style={{backgroundColor: this.props.color}}/>
                </ListItemIcon>
                <ListItemText primary={this.props.name}/>
            </ListItem>


        )
    }
}

// ---------- Container ----------

function mapStateToProps(state) {
    return state
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        selectLabel: () => {
            dispatch(selectLabel(ownProps));
        }
    }
}

const BrushLabel = connect(
    mapStateToProps,
    mapDispatchToProps
)(BrushLabelP);

export default BrushLabel;