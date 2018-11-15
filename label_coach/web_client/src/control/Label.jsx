import * as React from "react";

import {connect} from "react-redux";

import Counter from "./Counter";
import "../styles/Label.css"
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

class LabelP extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event, expanded) {
        this.props.expandLabel(this.props.label.id, expanded)
    }

    render() {
        let {ann, expanded, color, name, id} = this.props.label;

        let count = ann.polygons.length + ann.lines.length + ann.brushes.length;
        return (
            <ExpansionPanel expanded={expanded} onChange={this.handleChange}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                    <div className={"lbl-dot"} style={{backgroundColor: color}}/>
                    <Typography variant={"body1"}>{name}</Typography>
                    <Counter key={"c_" + id} count={count}/>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className="remove-all-padding">
                    {this.props.children}
                </ExpansionPanelDetails>
            </ExpansionPanel>
        )
    }
}

// ---------- Container ----------

function mapStateToProps(state) {
    return state
}

function mapDispatchToProps(dispatch) {
    return {};
}

const Label = connect(
    mapStateToProps,
    mapDispatchToProps
)(LabelP);

export default Label;