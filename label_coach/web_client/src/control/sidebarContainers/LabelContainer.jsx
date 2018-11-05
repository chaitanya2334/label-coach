import * as React from "react";
import "../../styles/LabelContainer.css"
import {connect} from "react-redux";
import Label from "../Label";
import {EnhancedTable} from "../EnhancedTable";
import {expandLabel} from "../controlActions";


export class LabelContainerP extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        let rows = [];
        if (this.props.labels.length > 0) {
            this.props.labels.forEach((label, i) => {
                rows.push(
                    <Label label={label} expandLabel={this.props.expandLabel}>
                        <EnhancedTable label_id={this.props.label.id} label={this.props.label}/>
                    </Label>
                );
            });
        }
        return (
            <div className="label-container">
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
        labels: getSearchLabels(state.labels, state.searchLabels)
    }
}

function mapDispatchToProps(dispatch) {
   return {
        expandLabel: (label_id, state) => {
            dispatch(expandLabel(label_id, state));
        }
    }
}

export const LabelContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(LabelContainerP);