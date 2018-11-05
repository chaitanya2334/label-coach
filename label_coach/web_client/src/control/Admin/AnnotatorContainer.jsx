import * as React from "react";
import "../../styles/LabelContainer.css"
import {connect} from "react-redux";
import ViewLabel from "../Admin/ViewLabel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "../../../../node_modules/@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import Counter from "../Counter";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import Annotator from "./Annotator";



export class AnnotatorContainerP extends React.Component {
    constructor(props) {
        super(props);

    }



    render() {
        let rows = [];
        if (this.props.annotators.length > 0) {
            this.props.annotators.forEach((annotator, i) => {
                rows.push(<Annotator key={i} annotator={annotator}/>);
            });
        }
        return (
            <div className="ann-container">
                {rows}
            </div>
        );
    }
}


// ---------- Container ----------

function getSearchLabels(labels, searchTerm) {
    return labels.filter(item => item.name.match(searchTerm));
}

function mapStateToProps(state) {
    return {
        annotators: state.adminData.annotators
    }
}

function mapDispatchToProps(dispatch) {
    return {};
}

export const AnnotatorContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(AnnotatorContainerP);