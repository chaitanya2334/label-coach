import * as React from "react";
import {connect} from "react-redux";
import "../styles/BrushLabel.css"
import {selectLabel, unlockAnnotation} from "./controlActions";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

class LabelSelectorP extends React.Component {
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
                    <div className={"dot"} id={this.type + "_" + this.props.name}
                         style={{backgroundColor: this.props.color}}/>
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

const LabelSelector = connect(
    mapStateToProps,
    mapDispatchToProps
)(LabelSelectorP);

export default LabelSelector;