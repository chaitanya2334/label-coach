import * as React from "react";
import {faAngleDown, faAngleUp} from '@fortawesome/free-solid-svg-icons'
import {connect} from "react-redux";
import AnnotationListP from "./AnnotationList";
import Counter from "./Counter";
import "../styles/Label.css"
import {expandLabel} from "./controlActions";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {EnhancedTable, EnhancedTableHead} from "./EnhancedTable";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";

class LabelP extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event, expanded) {
        this.props.expandLabel(this.props.id, expanded)
    }

    render() {
        let count = this.props.polygons.length + this.props.lines.length;

        return (
            <ExpansionPanel expanded={this.props.expanded} onChange={this.handleChange}>

                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                    <div className={"lbl-dot"} style={{backgroundColor: this.props.color}}/>
                    <Typography>{this.props.name}</Typography>
                    <Counter key={"c_" + this.props.id} count={count}/>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className="remove-all-padding">
                    <EnhancedTable label_id={this.props.id}/>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        )
    }
}

// ---------- Container ----------

function mapStateToProps(state) {
    return state
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        expandLabel: (label_id, state) => {
            dispatch(expandLabel(label_id, state));
        }
    }
}

const Label = connect(
    mapStateToProps,
    mapDispatchToProps
)(LabelP);

export default Label;