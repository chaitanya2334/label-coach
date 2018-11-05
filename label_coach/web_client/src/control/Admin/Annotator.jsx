import * as React from "react";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import Counter from "../Counter";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import connect from "react-redux/es/connect/connect";
import {expandAdminAnnotator} from "./AdminActions";
import ViewLabel from "./ViewLabel";
import Paper from "@material-ui/core/Paper";

class AnnotatorP extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event, expanded) {
        this.props.expandLabel(this.props.annotator.user._id, expanded)
    }

    getLabelContainer(user_id, labels) {
        let rows = [];
        if (labels.length > 0) {
            labels.forEach((label, i) => {
                rows.push(<ViewLabel key={i} user_id={user_id} label={label}/>);
            });
        }

        return rows;
    }

    render() {
        let {expanded, labels, user} = this.props.annotator;
        let count = 0;
        labels.forEach((label, i) => {
            count += label.ann.polygons.length + label.ann.lines.length + label.ann.brushes.length;
        });
        console.log(user, expanded);
        return (
            <ExpansionPanel key={user._id} expanded={expanded} onChange={this.handleChange}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>} style={{backgroundColor: "#ECEDED"}}>
                    <Typography variant={"subheading"}>{user.login}</Typography>
                    <Counter key={"c_" + user._id} count={count}/>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className="remove-all-padding flex-column" style={{backgroundColor: "#ECEDED"}}>
                    {this.getLabelContainer(user._id, labels)}
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }
}

// ---------- Container ----------

function mapStateToProps(state) {
    return state
}

function mapDispatchToProps(dispatch) {
    return {
        expandLabel: (user_id, state) => {
            dispatch(expandAdminAnnotator(user_id, state));
        }
    };
}

const Annotator = connect(
    mapStateToProps,
    mapDispatchToProps
)(AnnotatorP);

export default Annotator;